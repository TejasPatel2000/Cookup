const Koa = require('koa');
const serve = require('koa-static');
const logger = require('koa-logger');
const koaBody = require('koa-body');
const routes = require('./routes');
const { normalizePort, connectDB } = require('./utils');

const app = new Koa();
const port = normalizePort(process.env.PORT || '3000');

app.use(logger());

app.use(serve('public'));

app.context.db = connectDB();
app.use(koaBody());

app.use(routes);

app.context.db.once('open', () => {
  app.listen(port);
});
