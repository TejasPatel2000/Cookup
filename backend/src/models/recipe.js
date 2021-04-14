const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  servings: {
    type: Number,
  },
  prep_time: {
    type: Number,
  },
  cook_time: {
    type: Number,
  },
  ingredients: {
    type: [String],
  },
  instructions: {
    type: String,
  },
  tags: {
    type: [String],
    lowercase: true,
  },
});

recipeSchema.index({
  name: 'text',
  description: 'text',
  ingredients: 'text',
  instructions: 'text',
  tags: 'text',
},
{
  weights: {
    name: 3,
    ingredients: 2,
    instructions: 2,
  },
  name: 'recipe_text',
});

recipeSchema.statics.findByUser = function (user) {
  return this.find({
    by: user,
  });
};

recipeSchema.statics.findBySearch = function (query) {
  return this.find({ $text: { $search: query } });
};

recipeSchema.statics.findBytag = function (query) {
  return this.find({ tags: query });
};

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
