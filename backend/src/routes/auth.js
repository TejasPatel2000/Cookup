const Router = require('@koa/router');
const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

const { TOTP, User } = require('../models');
const { randomUsername } = require('../utils');

const router = new Router();

router.post('/sms/send', async (ctx) => {
  ctx.body = {};
  const { phone } = ctx.request.body;
  const totp = await TOTP.findOrCreate(phone);

  try {
    await twilio.messages.create({
      to: phone,
      from: process.env.TWILIO_NUMBER,
      body: `[CookUp] Use ${totp.generate()} to verify your identity.`,
    });
  } catch (err) {
    ctx.body.success = false;
    return;
  }

  ctx.body.success = true;
});

router.post('/login', async (ctx) => {
  ctx.body = {};
  const {
    login, token,
  } = ctx.request.body;

  const user = await User.findByLogin(login);

  if (!user) {
    ctx.body.success = false;
    return;
  }

  const totp = await TOTP.findOrCreate(user.phone);
  const success = totp.verify(token);

  ctx.body.success = success;

  if (success) ctx.body.jwt = 'jwt_';
});

router.post('/register', async (ctx) => {
  ctx.body = {};
  const {
    phone, token, fullName, dob,
  } = ctx.request.body;

  const totp = await TOTP.findOrCreate(phone);
  const success = totp.verify(token);

  if (success) {
    const user = new User({
      phone,
      fullName,
      dob: dob * 1000,
      username: await randomUsername(),
    });

    try {
      await user.save();
    } catch (err) {
      ctx.body.success = false;
      return;
    }

    ctx.body.success = true;
    ctx.body.user = JSON.stringify(user);
    return;
  }

  // TODO: Create a new user and return a JWT
  ctx.body.success = false;
});

module.exports = router.routes();