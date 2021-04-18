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
}, { timestamps: true });

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
  }).sort({ updatedAt: 'desc' });
};

recipeSchema.statics.findBySearch = function (query) {
  return this.find({
    $text: { $search: query },
  }).sort({ updatedAt: 'desc' });
};

recipeSchema.statics.findBytag = function (query) {
  return this.find({
    tags: {
      $all: query,
    },
  }).sort({ updatedAt: 'desc' });
};

recipeSchema.pre('save', async function () {
  await Promise.all(this.tags.map(async (tag) => {
    await mongoose.model('Tag').updateOne(
      { name: tag },
      {
        $setOnInsert: { name: tag },
      },
      { upsert: true },
    );
  }));
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
