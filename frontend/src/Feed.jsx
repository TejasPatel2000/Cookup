import React, { useContext, useEffect, useState } from 'react';
import _uniqueId from 'lodash/uniqueId';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';

import moment from 'moment';
import AppContext from './AppContext';

function Feed() {
  const [feed, setFeed] = useState([]);

  const {
    feedFilter, setFeedFilter, followTags, profile,
  } = useContext(AppContext);

  async function fetchRecipes() {
    const { user, tags, search } = feedFilter;

    const req = await fetch(`/api/recipe?${user ? `user=${user}` : ''}${(tags || []).length ? `tags=${tags.join()}` : ''}${search ? `search=${search}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const res = await req.json();
    const recipes = res.recipes.map((recipe) => ({ ...recipe, likes: new Set(recipe.likes) }));
    setFeed(recipes || []);
  }

  async function likeRecipe(recipe, indx) {
    const { _id: id } = recipe;

    const req = await fetch('/api/recipe/like',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeId: id,
        }),
      });

    const res = await req.json();
    const updated = [...feed];
    updated[indx].likes = new Set(res.likes);
    setFeed(updated);
  }

  useEffect(() => {
    fetchRecipes();
  }, [feedFilter]);

  return (
    <div>
      { feed.map((recipe, indx) => (
        <div key={_uniqueId()} className="box">
          <article className="media">
            <div className="media-content">
              <small className="is-pulled-right">{moment(recipe.updatedAt).fromNow()}</small>
              <div className="is-flex is-flex-direction-row is-align-items-center">
                <figure className="image is-32x32">
                  <img className="is-rounded" src="https://bulma.io/images/placeholders/128x128.png" alt="pofile" />
                </figure>
                <a href="#" onClick={() => { setFeedFilter({ user: recipe.by.username }); }}>
                  <strong className="username" style={{ marginLeft: '5px' }}>
                    @
                    {recipe.by.username}
                  </strong>
                </a>
              </div>
              <div className="content">
                <p>
                  <br />
                  <strong>{recipe.name}</strong>
                  {' '}
                  <br />
                  {recipe.description}
                  <br />
                  Ingredients:
                  {' '}
                  {recipe.ingredients.join()}
                  <br />
                  Instructions:
                  <br />
                  {recipe.instructions}
                  <br />
                </p>
                <div className="field is-grouped is-grouped-multiline">
                  { recipe.tags.map((tag) => (
                    <div className="control" key={_uniqueId()}>
                      <div className="tags has-addons">
                        <a href="#" className="tag is-rounded is-link" onClick={() => { setFeedFilter({ tags: [tag] }); }}>{tag}</a>
                        {(profile.username && !profile.following.includes(tag)) ? <a href="#" className="tag is-rounded is-info" onClick={() => { followTags([tag]); }}>+</a> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <nav className="level is-mobile">
                <div className="level-left">
                  <a
                    href="#"
                    className="level-item"
                    aria-label="like"
                    onClick={() => {
                      likeRecipe(recipe, indx);
                    }}
                  >
                    <span className="icon is-small">
                      <FontAwesomeIcon
                        icon={recipe.likes.has(profile.id) ? faHeartSolid : faHeart}
                      />
                    </span>
                  </a>
                  <p className="level-item"><strong>{recipe.likes.size}</strong></p>
                </div>
              </nav>
            </div>
          </article>
        </div>
      )) }
    </div>
  );
}

export default Feed;
