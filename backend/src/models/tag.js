const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxLength: 250,
  },
  followers_num: {
    type: Number,
  },
  post_num: {
    type: Number,
  },
});

tagSchema.index({
  name: 'text',
  description: 'text',
},
{
  weights: {
    name: 3,
    description: 1,
  },
  name: 'tag_text',
});

tagSchema.statics.findBySearch = function (query) {
  return this.find({ $text: { $search: query } });
};

tagSchema.statics.findByName = function (query) {
  return this.find({ name: query });
};

const Tag = mongoose.model('Tag', groupSchema);

module.exports = Tag;
