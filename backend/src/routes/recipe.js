const Router = require('@koa/router');
const {
  Recipe, User, Like, Comment,
} = require('../models');
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
  const { recipeId } = ctx.request.body;

  const user = await User.findByLogin(session.user);
  const recipe = await Recipe.findById(recipeId);

  if (user && recipe) {
    let like = await Like.findOne({ user, recipe });

    if (like) {
      await like.delete();
      ctx.body.success = true;
    } else {
      try {
        like = new Like({
          user,
          recipe,
        });

        await like.save();

        ctx.body.success = true;
      } catch (err) {
        ctx.body.success = false;
        console.log(err);
      }
    }

    ctx.body.likes = await recipe.getLikes();
    return;
  }

  ctx.body.success = false;
});

router.post('/comment', async (ctx) => {
  ctx.body = {};
  const { session } = ctx;
  const { recipeId, text } = ctx.request.body;

  const user = await User.findByLogin(session.user);
  const recipe = await Recipe.findById(recipeId);

  if (user && recipe && text) {
    try {
      const comment = new Comment({
        by: user,
        recipe,
        text,
      });

      comment.save();
    } catch (err) {
      console.log(err);
      ctx.body.success = false;
    }

    ctx.body.success = true;
    return;
  }

  ctx.body.success = false;
});

router.post('/update', async (ctx) => {
  ctx.body = {};
  const { session } = ctx;
  const {
    id,
    name,
    description,
    servings,
    prep_time: prepTime,
    cook_time: cookTime,
    ingredients,
    instructions,
    tags,
  } = ctx.request.body;

  const user = await User.findByLogin(session.user);
  const recipe = await Recipe.findById(id);

  if (user && recipe) {
    try {
      recipe.name = name;
      recipe.description = description;
      recipe.servings = servings;
      recipe.prep_time = prepTime;
      recipe.cook_time = cookTime;
      recipe.ingredients = ingredients;
      recipe.instructions = instructions;
      recipe.tags = tags;

      await recipe.save();
    } catch (err) {
      console.log(err);
      ctx.body.success = false;
      return;
    }
    ctx.body.success = true;
    return;
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
      .populate('by', 'username')
      .populate({
        path: 'comments',
        populate: [
          {
            path: 'by',
            model: 'User',
          },
        ],
      })
      .populate('likes');

    ctx.body.recipes = recipes.map((recipe) => {
      const userLikes = recipe.likes.map((like) => like.user);
      return ({ ...recipe.toObject(), likes: userLikes });
    });

    ctx.body.success = true;
  } catch (err) {
    ctx.body.success = false;
    console.log(err);
  }
});

module.exports = router.routes();
