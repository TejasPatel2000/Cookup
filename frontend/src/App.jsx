import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faClone, faUser, faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import _uniqueId from 'lodash/uniqueId';
import cloneDeep from 'lodash.clonedeep';

import AppContext from './AppContext';
import LoginModal from './LoginModal';
import Feed from './Feed';
import CreateRecipe from './CreateRecipe';
import EditProfile from './UserModal';
import AboutModal from './AboutModal';

function App() {
  const [profile, setProfile] = useState({});
  const [feedFilter, setFeedFilter] = useState({});
  const [mobileMenu, setMobileMenu] = useState(false);
  const [authVisible, setAuthVisible] = useState(false);
  const [recipeVisible, setRecipeVisible] = useState(false);
  const [userVisible, setUserVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);

  async function logout() {
    const req = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const res = await req.json();
    setProfile(res.success ? {} : profile);
  }

  async function followTags(tags) {
    const req = await fetch('/api/follow/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tags,
      }),
    });

    const res = await req.json();

    setProfile((val) => {
      if (!res.success) return val;

      const following = new Set([...val.following, ...tags]);
      const newProfile = cloneDeep(val);
      newProfile.following = [...following];
      return newProfile;
    });
  }

  useEffect(async () => {
    const req = await fetch('/api/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const res = await req.json();
    setProfile(res.user || {});
  }, []);

  const profileHeader = profile.username ? (
    <div className="has-text-centered">
      <div className="columns is-flex is-centered">
        <figure className="image is-128x128">
          <img className="is-rounded" alt="profile" src="https://bulma.io/images/placeholders/128x128.png" />
        </figure>
      </div>
      <p className="menu-label">
        {profile.fullName}
      </p>
      <p className="menu-label">
        @
        {profile.username}
      </p>
      <nav className="level">
        <div className="level-item">
          <div>
            <p className="heading">Posts</p>
            <p className="subtitle">3,456</p>
          </div>
        </div>
        <div className="level-item">
          <div>
            <p className="heading">Following</p>
            <p className="subtitle">123</p>
          </div>
        </div>
        <div className="level-item">
          <div>
            <p className="heading">Followers</p>
            <p className="subtitle">456K</p>
          </div>
        </div>
      </nav>
    </div>
  ) : null;

  return (
    <AppContext.Provider value={{
      profile,
      setProfile,
      setFeedFilter,
      feedFilter,
      authVisible,
      setAuthVisible,
      userVisible,
      setUserVisible,
      recipeVisible,
      setRecipeVisible,
      followTags,
      aboutVisible,
      setAboutVisible,
    }}
    >
      <nav className="navbar is-spaced" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
            CookUp!
          </a>

          <a role="button" href="#" className="navbar-burger" aria-label="menu" onClick={() => { setMobileMenu(!mobileMenu); }} aria-expanded={mobileMenu}>
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </a>
        </div>
        <div className="container is-max-desktop">
          <div className={`navbar-menu ${mobileMenu ? 'is-active' : ''}`}>
            <div className="navbar-start is-hidden-tablet">
              {profileHeader}
              <a className="navbar-item">Home</a>
              <a className="navbar-item">Collection</a>
              <a className="navbar-item">About</a>
              <div className="navbar-item has-dropdown">
                <a className="navbar-link">Followed Tags</a>
                {profile.following ? (
                  <div className="navbar-dropdown">
                    {profile.following.map((tag) => (
                      <a href="#" onClick={() => { setFeedFilter({ tags: [tag] }); }} className="navbar-item" key={_uniqueId()}>
                        #
                        {tag}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="navbar-end">
              <div className="navbar-item is-expanded">
                <div className="field has-addons">
                  <div className="control is-expanded">
                    <input onChange={(event) => { setFeedFilter({ search: event.target.value }); }} className="input" type="text" placeholder="Search" />
                  </div>
                </div>
              </div>
              {profile.username ? (
                <div className="navbar-item">
                  <div className="buttons">
                    <a href="#" className="button is-primary is-fullwidth" onClick={() => { setRecipeVisible(true); }}>
                      Create Recipe
                    </a>
                  </div>
                </div>
              ) : null}
              { profile.username ? (
                <div className="navbar-item">
                  <div className="buttons">
                    <a href="#" className="button is-danger is-fullwidth" onClick={() => { logout(); }}>Log out</a>
                  </div>
                </div>
              ) : (
                <div className="navbar-item">
                  <div className="buttons">
                    <a href="#" className="button is-primary is-fullwidth" onClick={() => { setAuthVisible(true); }}>Sign Up</a>
                  </div>
                </div>
              ) }
            </div>
          </div>
        </div>
      </nav>
      <section className="container is-fullheight is-fluid">
        <div className="columns">
          {/* Start of sidebar  */}
          <aside className="column is-3-desktop is-4-tablet menu is-fullheight section is-hidden-mobile">
            {profileHeader}
            <hr className="navbar-divider" />
            <ul className="menu-list">
              <li href="#" role="menuitem" tabIndex={0} onClick={() => { setFeedFilter({}); }} onKeyDown={() => { setFeedFilter({}); }}>
                <a className="is-active">
                  <span className="icon">
                    <FontAwesomeIcon icon={faHome} />
                  </span>
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a>
                  <span className="icon">
                    <FontAwesomeIcon icon={faClone} />
                  </span>
                  <span>Collection</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => { setUserVisible(true); }}>
                  <span className="icon">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  <span>Profile</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => { setAboutVisible(true); }}>
                  <span className="icon">
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </span>
                  <span>About</span>
                </a>
              </li>
            </ul>
            <p className="menu-label">Followed Tags</p>
            {profile.following ? (
              <ul className="menu-list">
                {profile.following.map((tag) => (
                  <li key={_uniqueId()}>
                    <a href="#" onClick={() => { setFeedFilter({ tags: [tag] }); }}>
                      #
                      {tag}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            <hr className="navbar-divider" />
          </aside>
          {/* End of sidebar */}
          <div className="column">
            {/* Content goes here */}
            <div className="container is-max-desktop">
              <Feed />
            </div>
            <br />
          </div>
        </div>
      </section>
      <CreateRecipe />
      <LoginModal />
      <EditProfile user={profile.username} />
      <AboutModal />
    </AppContext.Provider>
  );
}

export default App;
