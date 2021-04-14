import React, { useContext, useEffect, useState } from 'react';
import _uniqueId from 'lodash/uniqueId';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';

import moment from 'moment';
import AppContext from './AppContext';

function Feed() {
  const appContext = useContext(AppContext);
  const [recipes, setRecipes] = useState([]);
  function giveResult(recipeList) {
    setRecipes(recipeList);
  }

  useEffect(async () => {
    const { user, tags, searchText } = appContext.feedFilter;
    const req = await fetch(`/api/recipe?${user ? `user=${user}` : ''}${(tags || []).length ? `tags=${tags.join()}` : ''}${searchText ? `searchText=${searchText}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const res = await req.json();
    if (res.success) giveResult(res.recipes);
  }, []);
  return (
    <div>
      {console.log(recipes)}
      { recipes.map((recipe) => (
        <div key={_uniqueId()} className="box">
          <article className="media">
            <div className="media-content">
              <small className="is-pulled-right">{moment(recipe.updatedAt).fromNow()}</small>
              <div className="is-flex is-flex-direction-row is-align-items-center">
                <figure className="image is-32x32">
                  <img className="is-rounded" src="https://bulma.io/images/placeholders/128x128.png" alt="pofile" />
                </figure>
                <strong style={{ marginLeft: '5px' }}>
                  @
                  {recipe.by.username}
                </strong>
              </div>
              <div className="content">
                <p>
                  <br />
                  <strong>{recipe.name}</strong>
                  {' '}
                  <br />
                  {recipe.description}
                  <br />
                  <strong>Ingredients:</strong>
                  <br />
                  {recipe.ingredients.join()}
                  <br />
                  <strong>Instructions:</strong>
                  <br />
                  {recipe.instructions}
                </p>
              </div>
              <nav className="level is-mobile">
                <div className="level-left">
                  <a className="level-item" aria-label="reply">
                    <span className="icon is-small">
                      <FontAwesomeIcon icon={faHeart || faHeartSolid} />
                    </span>
                    {recipe.tags}
                  </a>
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
