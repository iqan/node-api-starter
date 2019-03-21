//  Test Configuration Object
const userInfo = {
  user1: { userName: 'user1', userId: 'some-unique-user-id-1' }
};

const auth = {
  payload: { name: 'somename' },
  secret: 'some-secret-value',
  expiresInOneHour: '1h',
  expiresInOneMilliSecond: '1ms'
}

const reminders = {
  rem1: { userName: 'user1', note: { title: 'title1', text: 'text1' }, remindAt: new Date().toISOString(), userId: 'some-unique-user-id-1' },
  snoozedRem1: { userName: 'user1', note: { title: 'title1', text: 'text1' }, remindAt: new Date(2019, 1, 1).toISOString(), userId: 'some-unique-user-id-1' },
}

const notifications = {
  notification1: { userName: 'user2', notes: [{ title: 'title1', text: 'text1' }],  remindAt: new Date().toISOString() }
}

module.exports = {
    userInfo,
    auth,
    reminders,
    notifications
};
