const _ = require('lodash');
const { User, Tag } = require('./models');

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

exports.tagResolver = _.memoize(async (tagName) => {
  const tag = await Tag.findByName(tagName);
  const res = tag.toJSON();
  res.postCount = await tag.getPostCount();
  return res;
}, (tagName) => `${tagName}_${Math.floor(Date.now() / (60 * 60 * 1000))}`);

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

exports.checkRequired = (recipeName, recipeDescription) => {
  if(recipeName.length > 0 && recipeDescription.length){
    return true;
  }else{
    return false;
  }
}
