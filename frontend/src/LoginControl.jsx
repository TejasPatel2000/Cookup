import React, { useState } from 'react';
import _uniqueId from 'lodash/uniqueId';
import Dropdown from './components/Dropdown';
import { getMonthList } from './utils';

function LoginControl() {
  const date = new Date();
  const dateYear = date.getFullYear();
  const [nameId] = useState(_uniqueId());

  return (
    <div className="grid">
      <div className="column is-6">
        <div className="card">
          <header className="card-header">
            <p className="card-header-title">
              Sign up
            </p>
          </header>
          <div className="card-content">
            <div className="content">
              <div className="field">
                <label htmlFor={nameId} className="label">What&apos;s your name?</label>
                <div className="control">
                  <input id={nameId} className="input" type="text" placeholder="Full name" />
                </div>
              </div>
              <div className="field">
                <label htmlFor={nameId} className="label">When were you born?</label>
                <div className="field is-grouped is-grouped-multiline">
                  <p className="control">
                    <Dropdown label="Month" items={getMonthList()} />
                  </p>
                  <p className="control">
                    <Dropdown label="Day" items={(new Array(31)).fill().map((_, indx) => indx + 1)} />
                  </p>
                  <p className="control">
                    <Dropdown label="Year" items={(new Array(101 + (dateYear % 100))).fill().map((_, indx) => dateYear - indx)} />
                  </p>
                </div>
              </div>
            </div>
          </div>
          <footer className="card-footer">
            <a href="/" className="card-footer-item has-background-white-bis">Login</a>
            <a href="/" className="card-footer-item">Register</a>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default LoginControl;
