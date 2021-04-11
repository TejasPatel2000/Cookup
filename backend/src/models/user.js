const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    minLength: 12,
    maxLength: 12,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
    index: true,
  },
  username: {
    type: String,
    minLength: 3,
    required: true,
    unique: true,
    index: true,
  },
  dob: {
    type: Date,
    required: true,
  },
});

userSchema.statics.findByLogin = async function (login) {
  let user = await this.findOne({
    username: login,
  });

  if (!user) user = await this.findOne({ phone: login });

  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
