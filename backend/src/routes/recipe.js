const Router = require('@koa/router');
const { Recipe, User } = require('../models');

const router = new Router();

router.post('/post', async (ctx) => {
  const { session } = ctx;
  ctx.body = {};

  const user = await User.findByLogin(session.user);
  
  if (user) {
    const {
      name, description, servings, prep_time, cook_time, ingredients, instructions, tags,
    } = ctx.request.body;
    
    const recipe = new Recipe({
      by: user,
      name,
      description,
      servings,
      prep_time,
      cook_time,
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
});

module.exports = router.routes();
