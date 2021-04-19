const Router = require('@koa/router');
const { User } = require('../models');

const router = new Router();

router.post('/', async (ctx) => {
  const { session } = ctx;
  const { following: newTag } = ctx.request.body;
  ctx.body = {};

  const user = await User.findByLogin(session.user);
// if user not found
  if(!user) {
    ctx.body.success = false;
    return;
  }

// find the user by name and update push new tag to 'following' array
  try {
    await User.update(
    { _id: user._id },
    { '$push': { following: newTag.tag } },
    );
  } catch (err) {
    console.log(err);
    ctx.body.success = false;
    return;
  }
  
  ctx.body.success = true;
});

module.exports = router.routes();