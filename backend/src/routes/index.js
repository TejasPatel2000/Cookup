const Router = require('@koa/router');
const auth = require('./auth');
const { User } = require('../models');

const router = new Router({
  prefix: '/api',
});

// GET /api/profile
router.get('/profile', async (ctx) => {
  const { session } = ctx;

  ctx.body = {};

  const user = await User.findByLogin(session.user);

  if (user) {
    ctx.body.success = true;
    ctx.body.user = user;
  }
});

// POST /api/logout
router.post('/logout', async (ctx) => {
  const { session } = ctx;

  ctx.body = {};

  if (session.user) {
    ctx.session = null;
    ctx.body.success = true;
    return;
  }

  ctx.body.success = false;
});

router.use('/auth', auth);

module.exports = router.routes();
