const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true,
    index: true,
  },
});

likeSchema.index({
  user: 1,
  recipe: 1,
}, { unique: true });

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
