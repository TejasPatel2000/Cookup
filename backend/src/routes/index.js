const Router = require('@koa/router');
const auth = require('./auth');

const router = new Router({
  prefix: '/api',
});

router.get('/users', async (ctx) => {
  ctx.body = 'Respond with a resource';
});

router.use('/auth', auth);

module.exports = router.routes();
