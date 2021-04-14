const { User } = require('./models');

exports.normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) return val; // named pipe
  if (port >= 0) return port; // port number

  return false;
};

exports.random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

exports.randomUsername = async () => {
  let username = '';

  do {
    username = `user${exports.random(10000000000, 99999999999)}`;
    // eslint-disable-next-line no-await-in-loop
  } while (await User.findByLogin(username));

  return username;
};

exports.requireLogin = async (ctx, next) => {
  const user = await User.findByLogin(ctx.session.user);

  if (!user) {
    ctx.body = {};
    ctx.body.success = false;
    ctx.status = 511;
    return;
  }

  next();
};
