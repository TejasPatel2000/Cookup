const Router = require('@koa/router');
const { Tag, User } = require('../models');

const router = new Router();

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

  const tag = await ctx.memoized.tagResolver(tagName);

  if (tag) {
    ctx.body.success = true;
    ctx.body.tag = JSON.stringify(tag);
    return;
  }

  ctx.body.success = false;
});

module.exports = router.routes();
