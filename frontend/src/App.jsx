import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faHeart, faUser, faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import _uniqueId from 'lodash/uniqueId';
import cloneDeep from 'lodash.clonedeep';

import AppContext from './AppContext';
import LoginModal from './LoginModal';
import Feed from './Feed';
import CreateRecipe from './CreateRecipe';
import EditProfile from './UserModal';
import AboutModal from './AboutModal';
import companyLogo from './cookup.png';

function App() {
  const [profile, setProfile] = useState({});
  const [feedFilter, setFeedFilter] = useState({});
  const [mobileMenu, setMobileMenu] = useState(false);
  const [authVisible, setAuthVisible] = useState(false);
  const [recipeVisible, setRecipeVisible] = useState(false);
  const [userVisible, setUserVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [editRecipe, setEditRecipe] = useState(false);
  const [recipeID, setRecipeID] = useState('');

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
    const req = await fetch('/api/tag/follow/', {
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

  async function unFollowTags(tags) {
    const req = await fetch('/api/tag/unfollow/', {
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

      const unfollowed = new Set([...tags]);
      const newProfile = cloneDeep(val);
      newProfile.following = val.following.filter((v) => !unfollowed.has(v));
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
      <div className="icon2">
        <FontAwesomeIcon icon={faUserAlt} size="4x" />
      </div>
      <p className="menu-label">
        {profile.fullName}
      </p>
      <p className="menu-label">
        @
        {profile.username}
      </p>
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
      editRecipe,
      setEditRecipe,
      recipeID,
      setRecipeID,
    }}
    >
      <nav className="navbar is-spaced has-shadow has-navbar-fixed-top" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a href="/">
            <img src={companyLogo} alt="logo" />
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
                      <div className="navbar-item is-flex is-align-items-center">
                        <a href="#" onClick={() => { setFeedFilter({ tags: [tag] }); }} className="navbar-item is-flex-grow-1" key={_uniqueId()}>
                          #
                          {tag}
                        </a>
                        <button type="button" className="delete" aria-label="close" onClick={() => { unFollowTags([tag]); }} />
                      </div>
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
              {profile.username ? (
                <li>
                  <a href="#" onClick={() => { setFeedFilter({ liked: true }); }}>
                    <span className="icon">
                      <FontAwesomeIcon icon={faHeart} />
                    </span>
                    <span>Liked</span>
                  </a>
                </li>
              ) : null }
              {profile.username ? (
                <li>
                  <a href="#" onClick={() => { setFeedFilter({ user: profile.username }); }}>
                    <span className="icon">
                      <FontAwesomeIcon icon={faUser} />
                    </span>
                    <span>Profile</span>
                  </a>
                </li>
              ) : null }
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
                  <li className="is-flex is-align-items-center" key={_uniqueId()}>
                    <a className="is-flex-grow-1" href="#" onClick={() => { setFeedFilter({ tags: [tag] }); }}>
                      #
                      {tag}
                    </a>
                    <button type="button" className="delete" aria-label="close" onClick={() => { unFollowTags([tag]); }} />
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
