import React, { useState, useRef } from 'react';

export function LoginControl() {
  const userRef = useRef(null);
  const [logged, setLogin] = useState(false);
  const [thisUser, setthisUser] = useState('');
  //fetch('http://example.com/movies.json')
    //.then(response => response.json())
    //.then(data => console.log(data));
  function UserGreeting() {
    return <h1> Welcome! </h1>;
  }

  function GuestGreeting() {
    return <h1> Sign in! </h1>;
  }

  function Greeting(status) {
    const { isLoggedIn } = status;
    if (isLoggedIn) {
      return <UserGreeting />;
    }
    return <GuestGreeting />;
  }

  function LoginButton(logClick) {
    const { onClick } = logClick;
    return <button type="button" onClick={onClick}>Login</button>;
  }

  function LogoutButton(outClick) {
    const { onClick } = outClick;
    return <button type="button" onClick={onClick}>Logout</button>;
  }
  function SendUser() {
    if (userRef != null) {
      const username = userRef.current.value;
      setthisUser(username);
      console.log(username);
      //socket.emit('user', { user: username });
    }
    setLogin(true);
  }
  function RemoveUser() {
    if (userRef != null) {
      const username = userRef.current.value;
      setthisUser(username);
      //socket.emit('user logout', { user: username });
    }
    setLogin(false);
  }

  let button;
  if (logged) {
    button = (
      <div className="toppane">
        <Greeting className="greeting" isLoggedIn={logged} />
        Username here:
        {' '}
        <input ref={userRef} type="text" />
        <LogoutButton onClick={RemoveUser} />
      </div>
    );
  } else {
    button = (
      <div className="toppane">
        <Greeting className="greeting" isLoggedIn={logged} />
        {' '}
        Username here:
        {' '}
        <input ref={userRef} type="text" />
        <LoginButton onClick={() => SendUser()} />
      </div>
    );
  }
  return (
    <div className="container">
      {button}
    </div>
  );
}
