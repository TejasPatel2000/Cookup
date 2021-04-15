const Koa = require('koa');
const koaBody = require('koa-body');

const routes = require('../src/routes');

const app = new Koa();
app.keys = [process.env.SESSION_KEY || 'secret'];

app.use(koaBody());
app.use(routes);

exports.default = app;
