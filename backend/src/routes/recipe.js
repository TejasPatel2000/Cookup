const Router = require('@koa/router');
const { Recipe, User, Like } = require('../models');
const { checkRequired } = require('../utils');

const router = new Router();

router.post('/post', async (ctx) => {
  const { session } = ctx;
  ctx.body = {};

  const user = await User.findByLogin(session.user);

  if (user) {
    const {
      name,
      description,
      servings,
      prep_time: prepTime,
      cook_time: cookTime,
      ingredients,
      instructions,
      tags,
    } = ctx.request.body;
    if (checkRequired(name, description)) {
      const recipe = new Recipe({
        by: user,
        name,
        description,
        servings,
        prep_time: prepTime,
        cook_time: cookTime,
        ingredients,
        instructions,
        tags,
      });

      try {
        await recipe.save();
      } catch (err) {
        ctx.body.success = false;
        console.log(err);
        return;
      }

      ctx.body.success = true;
      ctx.body.recipe = JSON.stringify(recipe);
      return;
    }
    ctx.body.success = false;
    return;
  }

  ctx.body.success = false;
});

router.post('/like', async (ctx) => {
  ctx.body = {};
  const { session } = ctx;
  const { recipeId } = ctx.body.query;

  const user = await User.findByLogin(session.user);
  const recipe = await Recipe.findById(recipeId);

  if (user && recipe) {
    try {
      const like = new Like({
        user,
        recipe,
      });

      like.save();
    } catch (err) {
      console.log(err);
    }
  }

  ctx.body.success = false;
});

router.get('/', async (ctx) => {
  ctx.body = {};
  const { tags, user, search } = ctx.request.query;

  const filter = {};

  if (tags) filter.tags = { $all: tags };
  if (user) filter.by = await User.findByLogin(user);
  if (search) filter.$text = { $search: search };

  try {
    const recipes = await Recipe.find(filter)
      .sort({ updatedAt: 'desc' })
      .populate('by', 'username');

    ctx.body.recipes = recipes;
    ctx.body.success = true;
  } catch (err) {
    ctx.body.success = false;
    console.log(err);
  }
});

module.exports = router.routes();
