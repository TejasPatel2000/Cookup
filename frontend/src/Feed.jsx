/* eslint-disable no-param-reassign, no-underscore-dangle */
import React, { useContext, useEffect, useState } from 'react';
import _uniqueId from 'lodash/uniqueId';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid, faEdit } from '@fortawesome/free-solid-svg-icons';

import moment from 'moment';
import AppContext from './AppContext';
import EditProfile from './UserModal';

function Feed() {
  const [feed, setFeed] = useState([]);

  const {
    feedFilter,
    setFeedFilter,
    followTags,
    profile,
    setUserVisible,
    setEditRecipe,
    setRecipeVisible,
    setRecipeID,
    recipeID,
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
    setFeed(res.recipes || []);
  }

  useEffect(() => {
    fetchRecipes();
  }, [feedFilter]);

  return (
    <div>
      { feed.map((recipe) => (
        <div key={_uniqueId()} className="box">
          <article className="media">
            <div className="media-content">
              <small className="is-pulled-right">{moment(recipe.updatedAt).fromNow()}</small>
              <div className="is-flex is-flex-direction-row is-align-items-center">
                <figure className="image is-32x32">
                  <img className="is-rounded" src="https://bulma.io/images/placeholders/128x128.png" alt="pofile" />
                </figure>
                <a href="#" onClick={() => { setUserVisible(true); }}>
                  <EditProfile FeedUser={recipe.by.username} />
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
                  <div className="field is-grouped is-grouped-multiline">
                    { recipe.tags.map((tag) => (
                      <div className="control" key={_uniqueId()}>
                        <div className="tags has-addons">
                          <a href="#" className="tag is-rounded is-link" onClick={() => { setFeedFilter({ tags: [tag] }); }}>{tag}</a>
                          {profile.username ? <a href="#" className="tag is-rounded is-info" onClick={() => { followTags([tag]); }}>+</a> : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </p>
              </div>
              <nav className="level is-mobile">
                <div className="level-left">
                  <a className="level-item" aria-label="like">
                    <span className="icon is-small">
                      <FontAwesomeIcon icon={faHeart || faHeartSolid} />
                    </span>
                  </a>
                </div>
                <a href="#" onClick={() => { setRecipeID(recipe._id.toString()); setEditRecipe(true); setRecipeVisible(true); }}>
                  {recipeID}
                  <span className="icon is-pulled-right">
                    <FontAwesomeIcon icon={faEdit} />
                  </span>
                </a>
              </nav>
            </div>
          </article>
        </div>
      )) }
    </div>
  );
}

export default Feed;
