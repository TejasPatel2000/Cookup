const Router = require('@koa/router')

const router = new Router({
    prefix: '/api'
})

router.get('/users', ctx => {
    ctx.body = 'Respond with a resource'
})

module.exports = router.routes()
