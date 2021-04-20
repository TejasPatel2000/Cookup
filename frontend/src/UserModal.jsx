/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */

import React, { useRef, useContext } from 'react';
import AppContext from './AppContext';

function EditProfile(props) {
  const DisplayName = useRef(null);
  const description = useRef(null);
  const servings = useRef(null);
  const prepTime = useRef(null);
  const cookTime = useRef(null);
  const ingredients = useRef(null);
  const instructions = useRef(null);
  const tags = useRef(null);

  const appContext = useContext(AppContext);
  const username = props.user;
  async function submitForm() {
    if (DisplayName && description) {
      await fetch('/api/recipe/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: DisplayName.current.value,
          description: description.current.value,
          servings: servings.current.value,
          prep_time: prepTime.current.value,
          cook_time: cookTime.current.value,
          ingredients: ingredients.current.value.split(','),
          instructions: instructions.current.value,
          tags: tags.current.value.split(','),
        }),
      });
    }
    appContext.setUserVisible(false);
  }

  return (
    <div className={`modal ${appContext.userVisible ? 'is-active' : ''}`}>
      <div className="modal-background" />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Edit your Profile</p>
          <button type="button" className="delete" aria-label="close" onClick={() => { appContext.setUserVisible(false); }} />
        </header>
        <section className="modal-card-body">
          <div className="user-form">
            <p>
              { username }
            </p>
            <p>
              {props.FeedUser}
            </p>
            <input ref={DisplayName} className="input is-primary" type="text" placeholder="Display Name" />
          </div>
        </section>
        <footer className="modal-card-foot">
          <input type="submit" value="Submit" className="button is-success" onClick={submitForm} />
          <button type="button" className="button" onClick={() => { appContext.setUserVisible(false); }}>Cancel</button>
        </footer>
      </div>
    </div>
  );
}

export default EditProfile;
