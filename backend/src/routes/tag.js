const _ = require('lodash');
const Router = require('@koa/router');
const schedule = require('node-schedule');
const { Tag, User } = require('../models');

const router = new Router();

const tagResolver = _.memoize(async (tagName) => {
  const tag = await Tag.findByName(tagName);
  const res = tag.toJSON();
  res.postCount = await tag.getPostCount();
  return res;
}, (tagName) => `${tagName}_${Math.floor(Date.now() / (60 * 60 * 1000))}`);

// POST /api/tag/new
router.post('/new', async (ctx) => {
  const { session } = ctx;
  ctx.body = {};

  const user = await User.findByLogin(session.user);

  if (user) {
    const {
      name, description, followers,
    } = ctx.request.body;

    const tag = new Tag({
      name,
      description,
      followers,
    });

    try {
      await tag.save();
    } catch (err) {
      ctx.body.success = false;
      return;
    }

    ctx.body.success = true;
    ctx.body.tag = JSON.stringify(tag);
    return;
  }

  ctx.body.success = false;
});

router.get('/:tagName', async (ctx) => {
  const { tagName } = ctx.params;
  ctx.body = {};

  const tag = await tagResolver(tagName);

  if (tag) {
    ctx.body.success = true;
    ctx.body.tag = JSON.stringify(tag);
    return;
  }

  ctx.body.success = false;
});

schedule.scheduleJob('0 * * * *', () => {
  tagResolver.cache.clear();
});

module.exports = router.routes();
