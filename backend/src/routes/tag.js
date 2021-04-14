const Router = require('@koa/router');
const { Tag, User } = require('../models');

const router = new Router();

// POST /api/tag/post
router.post('/post', async (ctx) => {
  const { session } = ctx;
  ctx.body = {};

  const user = await User.findByLogin(session.user);
  
  if (user) {
    const {
      name, description, followers, posts,
    } = ctx.request.body;
    
    const tag = new Tag({
      name,
      description,
      followers,
      posts,
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

module.exports = router.routes();
