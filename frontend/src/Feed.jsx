import React from 'react';
import _uniqueId from 'lodash/uniqueId';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';

import moment from 'moment';
import AppContext from './AppContext';

function Feed() {
  async function onAdd(newTag) {
    if (newTag) {
      await fetch('/api/follow/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          following: newTag,
        }),
      });
    }
  }
  return (
    <AppContext.Consumer>
      { (value) => value.recipeFeed.map((recipe) => (
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
                  Ingredients:
                  {' '}
                  {recipe.ingredients.join()}
                  <br />
                  Instructions:
                  <br />
                  {recipe.instructions}
                  <br />
                  <div className="adding_tag">
                    { recipe.tags.map((tag) => (
                      <button type="button" className="button is-small is-rounded is-primary m-1" onClick={() => { onAdd({ tag }); }}>
                        {tag}
                      </button>
                    ))}
                  </div>
                </p>
              </div>
              <nav className="level is-mobile">
                <div className="level-left">
                  <a className="level-item" aria-label="reply">
                    <span className="icon is-small">
                      <FontAwesomeIcon icon={faHeart || faHeartSolid} />
                    </span>
                  </a>
                </div>
              </nav>
            </div>
          </article>
        </div>
      )) }
    </AppContext.Consumer>
  );
}

export default Feed;
