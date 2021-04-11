import React, { useState } from 'react';
import moment from 'moment';
import _uniqueId from 'lodash/uniqueId';
import Dropdown from './components/Dropdown';
import { getMonthList } from './utils';

function LoginControl() {
  const date = new Date();
  const dateYear = date.getFullYear();
  const months = getMonthList();
  const days = (new Array(31)).fill().map((_, indx) => indx + 1);
  const years = (new Array(101 + (dateYear % 100))).fill().map((_, indx) => dateYear - indx);

  const phonePtrn = /([0-9]){10}/g;
  const codePtrn = /([0-9]){6}/g;

  const [nameId] = useState(_uniqueId());
  const [phoneId] = useState(_uniqueId());
  const [dobId] = useState(_uniqueId());

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [month, setMonth] = useState(null);
  const [day, setDay] = useState(null);
  const [year, setYear] = useState(null);

  async function sms() {
    fetch('/api/auth/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: `+1${phone}` }),
    });
  }

  async function register() {
    if (name.length && month && day && year && phonePtrn.test(phone) && codePtrn.test(code)) {
      fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: `+1${phone}`,
          fullName: name,
          dob: moment(`${months[month]} ${day + 1} ${years[year]}`, 'MMM DD YYYY').unix(),
          token: code,
        }),
      });
    }
  }

  return (
    <div className="grid">
      <div className="column is-4">
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
                  <input id={nameId} value={name} onChange={(event) => { setName(event.target.value); }} className="input" type="text" placeholder="Full name" />
                </div>
              </div>
              <div className="field">
                <label htmlFor={dobId} className="label">When were you born?</label>
                <div id={dobId} className="field is-grouped is-grouped-multiline">
                  <div className="control">
                    <Dropdown label="Month" items={months} onChange={(indx) => { setMonth(indx); }} />
                  </div>
                  <div className="control">
                    <Dropdown label="Day" items={days} onChange={(indx) => { setDay(indx); }} />
                  </div>
                  <div className="control is-grouped-right">
                    <Dropdown label="Year" items={years} onChange={(indx) => { setYear(indx); }} />
                  </div>
                </div>
              </div>
              <div className="field">
                <label htmlFor={phoneId} className="label">Phone</label>
                <div className="field-body">
                  <div className="field has-addons">
                    <div className="control">
                      <button type="button" className="button is-static">
                        +1
                      </button>
                    </div>
                    <div className="control is-expanded">
                      <input id={phoneId} maxLength="10" value={phone} onChange={(event) => { setPhone(event.target.value); }} className="input" type="text" placeholder="Phone number" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="field has-addons is-pulled-right">
                <div className="control">
                  <input className="input" maxLength="6" value={code} onChange={(event) => { setCode(event.target.value); }} type="text" placeholder="Enter 6-digit code" />
                </div>
                <div className="control">
                  <button type="button" className="button" onClick={() => { sms(); }} disabled={!phonePtrn.test(phone)}>
                    Send code
                  </button>
                </div>
              </div>
              <br />
              <div className="field">
                <p className="control">
                  <button type="button" className="button is-primary is-fullwidth" onClick={() => { register(); }}>
                    Continue
                  </button>
                </p>
              </div>
            </div>
          </div>
          <footer className="card-footer">
            <button type="button" href="#" className="card-footer-item button is-ghost">Login</button>
            <button type="button" href="#" className="card-footer-item button is-light" disabled>Register</button>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default LoginControl;
