/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */

import React, { useRef, useContext } from 'react';
import AppContext from './AppContext';

function EditProfile(props) {
  const DisplayName = useRef(null);

  const appContext = useContext(AppContext);
  const username = props.user;
  async function submitForm() {
    if (DisplayName) {
      // shouldnt be this route but thats is for later
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: DisplayName.current.value,
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
