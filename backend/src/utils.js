const mongoose = require('mongoose');
const { User } = require('./models');

exports.normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) return val; // named pipe
  if (port >= 0) return port; // port number

  return false;
};

exports.random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

exports.connectDB = () => {
  mongoose.connect(
    process.env.MONGO_URL || 'mongodb://mongo/cookup',
    { keepAlive: 1, useNewUrlParser: true, useUnifiedTopology: true },
  );

  return mongoose.connection;
};

exports.randomUsername = async () => {
  let username = '';

  do {
    username = `user${exports.random(10000000000, 99999999999)}`;
    // eslint-disable-next-line no-await-in-loop
  } while (await User.findByLogin(username));

  return username;
};
