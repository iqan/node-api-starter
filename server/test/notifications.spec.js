const should = require('chai').should(); // eslint-disable-line no-unused-vars
const request = require('supertest');
const app = require('../app');
const config = require('./test.config');
const modules = require('../modules');

let user1Token;

// Initialize db connection before all tests
before((done) => {
  modules.initializeMongooseConnection()
    .then(() => {
      done();
    });
});

// clear notifications collection
before((done) => {
  modules.notificationModel.remove({}, (err) => {
    if(err) return done(err);
    done();
  });
});

// Get JWT token for user 1
before((done) => {
  const user1 = config.userInfo.user1;
  const auth = config.auth;
  modules.signJWTToken(user1, auth.secret, auth.expiresInOneHour, (err, token) => {
      if(err) return done(err);
      user1Token = token;
      done();
  });
});

//  testsuite
describe('Testing to add a reminder', function()
{
  //  testcase
  it('Should handle a request to add a new reminder for user', function(done)
  {
    const rem1 = config.reminders.rem1;
    request(app)
      .post('/api/v1/notifications/reminders')
      .set('Authorization', 'Bearer ' + user1Token)
      .send(rem1)
      .expect(201)
      .end((error, response) => {
        if(error) return done(error);
        response.body.should.not.equal(null, 'response should contain a body');
        const addedReminder = response.body.notification;
        addedReminder.should.not.equal(null, 'response should contain added reminder');
        addedReminder.userName.should.equal(rem1.userName, 'response should return added reminder');
        addedReminder.note.should.not.equal(null, 'added reminder should contain note');
        done();
      });
  });

  //  testcase
  it('Should handle a request to add a notification for user', function(done)
  {
    const notification1 = config.notifications.notification1;
    request(app)
      .post('/api/v1/notifications')
      .set('Authorization', 'Bearer ' + user1Token)
      .send(notification1)
      .expect(201)
      .end((error, response) => {
        if(error) return done(error);
        response.body.should.not.equal(null, 'response should contain a body');
        const addedNotifications = response.body.notifications;
        addedNotifications.should.not.equal(null, 'response should contain added notifications');
        addedNotifications[0].userName.should.equal(notification1.userName, 'response should return added notifications');
        addedNotifications[0].note.should.not.equal(null, 'added notification should contain note');
        addedNotifications[0].self.should.equal(false, 'notification should be for user 2');
        done();
      });
  });
});

//  testsuite
describe('Testing to get all reminders', function()
{
  //  testcase
  it('Should handle a request to get all reminders of a user', function(done)
  {
    request(app)
      .get('/api/v1/notifications/reminders')
      .set('Authorization', 'Bearer ' + user1Token)
      .expect(200)
      .end((error, response) => {
        if(error) return done(error);
        const reminders = response.body;
        reminders.should.not.equal(null, 'response should contain a body');        
        reminders.should.be.an('array', 'response should contain added reminder');
        done();
      });   
  });
});

//  testsuite
describe('Testing to snooze a reminder', function()
{
  it('Should handle a request to update a reminder by id', function(done)
  {
    const rem1 = config.reminders.rem1;
    const updatedRem = config.reminders.snoozedRem1;
    const notification = new modules.notificationModel({
      note: rem1.note,
      userId: rem1.userId,
      userName: rem1.userName,
      remindAt: rem1.remindAt
    });
    notification.save((err, savedNotification) => {
      if(err) return done(err);
      const remId = savedNotification._id;
      request(app)
        .put(`/api/v1/notifications/reminders/${remId}`)
        .set('Authorization', 'Bearer ' + user1Token)
        .expect(200)
        .send(updatedRem)
        .end((error, response) => {
          if(error) return done(error);
          const reminder = response.body.notification;
          reminder.remindAt.should.equal(updatedRem.remindAt, 'response should return updated time');
          done();
        });
    });
  });
});

describe('Dismiss a reminder scenarios', function () {
  it('Should handle request to delete a reminder', function(done) {
    const rem1 = config.reminders.rem1;
    const notification = new modules.notificationModel({
      note: rem1.note,
      userId: rem1.userId,
      userName: rem1.userName,
      remindAt: rem1.remindAt
    });
    notification.save((err, savedNotification) => {
      if(err) return done(err);
      const remId = savedNotification._id;
      request(app)
        .delete(`/api/v1/notifications/reminders/${remId}`)
        .set('Authorization', 'Bearer ' + user1Token)
        .expect(200)
        .end((error, response) => {
          if(error) return done(error);
          const body = response.body;
          body.should.not.equal(undefined);
          body.should.not.equal(null);
          body.message.should.equal('reminder dismissed', 'response should return message reminder dismissed');
          done();
        });
    });
  });
});

describe('Negative test scenarios', function() {
  it('Make a API request to a resource with invalid token, which requires authentication, should return forbidden status and error ', function(done) { 
    request(app)
      .get(`/api/v1/notifications/reminders`)
      .set('Authorization', 'Bearer invalid-token-to-get-unauthorized')
      .expect(403)
      .end((error, response) => {
        if(error) return done(error);
        const message = response.text;
        message.should.equal('invalid token', 'user should get invalid token error message');
        done();
      });
  });

  it('Make a API request to a resource without any token, which requires authentication, should return forbidden status and error ', function(done) {
    request(app)
      .get(`/api/v1/notifications/reminders`)
      .expect(403)
      .end((error, response) => {
        if(error) return done(error);
        const message = response.text;
        message.should.equal('Not authenticated', 'user should get Not authenticated error message');
        done();
      });
  });
});
