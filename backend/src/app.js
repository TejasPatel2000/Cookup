const Koa = require('koa');
const serve = require('koa-static');
const logger = require('koa-logger');
const koaBody = require('koa-body');
const mongoose = require('mongoose');

const koaSession = require('koa-generic-session');
const MongoStore = require('koa-generic-session-mongo');

const routes = require('./routes');
const { normalizePort } = require('./utils');

const app = new Koa();
app.keys = [process.env.SESSION_KEY || 'secret'];
const port = normalizePort(process.env.PORT || '3000');

app.use(logger());
app.use(serve('public'));
app.use(koaBody());

mongoose.connect(
  process.env.MONGO_URL || 'mongodb://mongo/cookup',
  {
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
);

mongoose.connection.once('open', async () => {
  app.use(koaSession({
    store: new MongoStore({ db: mongoose.connection.db })
  }))

  app.use(routes);

  app.listen(port);
});
