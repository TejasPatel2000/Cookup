const Router = require('@koa/router');
const { mongo, connection } = (require('mongoose'));
const fs = require('fs');

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
      images,
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
        images,
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
    images,
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
      recipe.images = images;

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

function pipeStream(src, dest) {
  return new Promise((resolve, reject) => {
    dest.on('error', () => reject(new Error('Failed to pipe to destination')));
    src.on('error', () => reject(new Error('Failed to pipe from source')));
    src.on('open', () => src.pipe(dest));
    dest.on('finish', () => resolve());
  });
}

router.get('/image/:fileName', async (ctx) => {
  const { fileName } = ctx.params;

  const bucket = new mongo.GridFSBucket(connection.db, {
    bucketName: 'photos',
  });

  const downStream = bucket.openDownloadStreamByName(fileName);
  ctx.body = downStream;
});

router.post('/images', async (ctx) => {
  ctx.body = {};
  const { session } = ctx;
  const { files } = ctx.request;

  const user = User.findByLogin(session.user);

  if (user) {
    const uploads = [];

    try {
      const bucket = new mongo.GridFSBucket(connection.db, {
        bucketName: 'photos',
      });

      await Promise.all(Object.values(files).map(async (file) => {
        const readStream = fs.createReadStream(file.path);
        const fileName = `${file.path.split('/').pop()}.${file.name.split('.').pop()}`;
        const upStream = bucket.openUploadStream(fileName);
        await pipeStream(readStream, upStream);
        uploads.push(fileName);
      }));
    } catch (err) {
      console.log(err);
      ctx.body.success = false;
      return;
    }

    ctx.body.uploads = uploads;
    ctx.body.success = true;
    return;
  }

  ctx.body.success = false;
});

router.get('/', async (ctx) => {
  ctx.body = {};
  const { session } = ctx;
  const {
    tags, user: poster, search, liked,
  } = ctx.request.query;

  const filter = {};

  if (tags) filter.tags = { $all: tags };
  if (poster) filter.by = await User.findByLogin(poster);
  if (search) filter.$text = { $search: search };
  if (liked) {
    const user = await User.findByLogin(session.user);
    const likes = await Like.find({ user });
    // eslint-disable-next-line no-underscore-dangle
    filter._id = likes.map((like) => like.recipe);
  }

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

router.post('/delete', async (ctx) => {
  ctx.body = {};
  const { session } = ctx;
  const { recipeId } = ctx.request.body;

  const user = await User.findByLogin(session.user);
  const recipe = await Recipe.findById(recipeId);

  if (user && recipe) {
    try {
      await recipe.remove();
      ctx.body.success = true;
    } catch (err) {
      ctx.body.success = false;
      console.log(err);
    }
  }

  ctx.body.success - false;
});

module.exports = router.routes();
