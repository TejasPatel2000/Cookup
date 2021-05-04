const Koa = require('koa');
const serve = require('koa-static');
const logger = require('koa-logger');
const koaBody = require('koa-body');
const mongoose = require('mongoose');
const twilio = require('twilio');

const session = require('koa-session');
const schedule = require('node-schedule');
const MongoStore = require('koa-session-mongoose');

const routes = require('./routes');
const { normalizePort, tagResolver } = require('./utils');

const app = new Koa();
app.keys = [process.env.SESSION_KEY || 'secret'];
const port = normalizePort(process.env.PORT || '3000');

app.use(logger());
app.use(serve('public'));
app.use(koaBody({
  multipart: true
}));

app.context.twilio = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_TOKEN,
);

app.context.memoized = {
  tagResolver,
};

// Scheduled for the start of the hour
schedule.scheduleJob('0 * * * *', () => {
  Object.values(app.context.memoized).forEach((f) => {
    f.cache.clear();
  });
});

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
  app.use(session({
    store: new MongoStore(),
  }, app));

  app.use(routes);

  app.listen(port);
});
