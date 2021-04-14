import React, { useState, useContext } from 'react';
import moment from 'moment';
import _uniqueId from 'lodash/uniqueId';
import AppContext from './AppContext';
import Dropdown from './components/Dropdown';

const codePtrn = /^\d{6}$/;
const phonePtrn = /^\d{10}$/;

const date = new Date();
const dateYear = date.getFullYear();
const months = moment.monthsShort();
const days = (new Array(31)).fill().map((_, indx) => indx + 1);
const years = (new Array(101 + (dateYear % 100))).fill().map((_, indx) => dateYear - indx);

function LoginModal() {
  const [nameId] = useState(_uniqueId());
  const [phoneId] = useState(_uniqueId());
  const [dobId] = useState(_uniqueId());
  const [newUser, setNewUser] = useState(true);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [month, setMonth] = useState(null);
  const [day, setDay] = useState(null);
  const [year, setYear] = useState(null);

  const appContext = useContext(AppContext);

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
      const req = await fetch('/api/auth/register', {
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

      const res = await req.json();
      appContext.setProfile(res.success ? res.user : {});
    }
  }

  async function login() {
    if (phonePtrn.test(phone) && codePtrn.test(code)) {
      const req = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: `+1${phone}`,
          token: code,
        }),
      });

      const res = await req.json();
      appContext.setProfile(res.success ? res.user : {});
    }
  }

  const infoFields = newUser ? (
    <div>
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
            <Dropdown label="Month" value={month} items={months} onChange={(indx) => { setMonth(indx); }} />
          </div>
          <div className="control">
            <Dropdown label="Day" value={day} items={days} onChange={(indx) => { setDay(indx); }} />
          </div>
          <div className="control is-grouped-right">
            <Dropdown label="Year" value={year} items={years} onChange={(indx) => { setYear(indx); }} />
          </div>
        </div>
      </div>
    </div>
  ) : null;

  const footer = newUser ? (
    <span>
      Already have an account?
      {' '}
      <a href="#" onClick={() => { setNewUser(false); }}>Login</a>
    </span>
  ) : (
    <span>
      Don&apos;t have an account?
      {' '}
      <a href="#" onClick={() => { setNewUser(true); }}>Register</a>
    </span>
  );

  return (
    <div className="card" style={{ maxWidth: '512px' }}>
      <header className="card-header">
        <p className="card-header-title">
          { newUser ? 'Sign up' : 'Login' }
        </p>
      </header>
      <div className="card-content">
        <div className="content">
          { infoFields }
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
          <div className="field">
            <p className="control">
              <button type="button" className="button is-primary is-fullwidth" onClick={() => { (newUser ? register : login)(); }}>
                { newUser ? 'Continue' : 'Login' }
              </button>
            </p>
          </div>
        </div>
      </div>
      <footer className="card-footer">
        <p className="card-footer-item">
          {footer}
        </p>
      </footer>
    </div>
  );
}

export default LoginModal;
