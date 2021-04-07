const Koa = require('koa')
const serve = require('koa-static')
const logger = require('koa-logger')
const routes = require('./routes')
const { normalizePort } = require('./utils')

const app = new Koa()
const port = normalizePort(process.env.PORT || '3000')

app.use(logger())
app.use(serve('public'))
app.use(routes)

app.listen(port)
