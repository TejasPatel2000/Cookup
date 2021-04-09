const mongoose = require('mongoose');
const { authenticator, totp } = require('otplib');

totp.options = { digits: 6, step: 5 * 60, window: 1 };

const totpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    minLength: 11,
    unique: true,
  },
  secret: {
    type: String,
    required: true,
    default: authenticator.generateSecret(),
  },
});

totpSchema.methods.verify = function (token) {
  return totp.verify({ token, secret: this.secret });
};

totpSchema.methods.generate = function () {
  return totp.generate(this.secret);
};

totpSchema.statics.findOrCreate = async function (phone) {
  let res = await this.findOne({
    phone,
  });

  if (!res) res = this.create({ phone });

  return res;
};

const TOTP = mongoose.model('TOTP', totpSchema);

module.exports = TOTP;
