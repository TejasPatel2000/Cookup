import React, { useContext, useEffect, useState } from 'react';
import _uniqueId from 'lodash/uniqueId';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';

import moment from 'moment';
import AppContext from './AppContext';

function Feed() {
<<<<<<< HEAD
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
    setFeed(res.recipes || []);
  }

  useEffect(() => {
    fetchRecipes();
  }, [feedFilter]);

=======
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
>>>>>>> User's following tags are fetched from DB and listed nicely on the sidebar menu
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
<<<<<<< HEAD
=======
                  <div className="adding_tag">
                    { recipe.tags.map((tag) => (
                      <button type="button" className="button is-primary is-rounded is-small m-1" onClick={() => { onAdd({ tag }); }}>
                        {tag}
                        <a className="is-size-5 m-1">+</a>
                      </button>
                    ))}
                  </div>
>>>>>>> User's following tags are fetched from DB and listed nicely on the sidebar menu
                </p>
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
              </div>
              <nav className="level is-mobile">
                <div className="level-left">
                  <a className="level-item" aria-label="like">
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
    </div>
  );
}

export default Feed;
