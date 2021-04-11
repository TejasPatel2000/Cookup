const Koa = require('koa');
const serve = require('koa-static');
const logger = require('koa-logger');
const koaBody = require('koa-body');
const mongoose = require('mongoose');

const koaSession = require('koa-atomic-session');

const routes = require('./routes');
const { normalizePort } = require('./utils');

const app = new Koa();
app.keys = [process.env.SESSION_KEY || 'secret'];
const mongoSession = koaSession(app);
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
  mongoSession.collection = mongoose.connection.db.collection('sessions');
  mongoSession.ensureIndex();
  app.listen(port);
});

app.use(routes);
