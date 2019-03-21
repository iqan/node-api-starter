const appConfig = {
  port: process.env.PORT || 3000
};

const dbConfig = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/notes-app-local'
};

const logConfig = {
  level: process.env.LOG_LEVEL || 'debug'
};

module.exports = {
  appConfig,
  dbConfig,
  logConfig
}
