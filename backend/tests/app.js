const Koa = require('koa');
const koaBody = require('koa-body');
const session = require('koa-session');
const MongoStore = require('koa-session-mongoose');
const routes = require('../src/routes');

const app = new Koa();
app.keys = [process.env.SESSION_KEY || 'secret'];

app.use(session({
  store: new MongoStore(),
}, app));

app.use(koaBody());
app.use(routes);

module.exports = app;
