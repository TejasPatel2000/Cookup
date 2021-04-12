import React, { useState } from 'react';
import AppContext from './AppContext';
import LoginControl from './LoginControl';

function App() {
  const [profile, setProfile] = useState({});

  return (
    <AppContext.Provider value={{ profile, setProfile }}>
      <div className="App">
        <LoginControl />
        <p>{profile.username}</p>
        <p>{profile.fullName}</p>
      </div>
    </AppContext.Provider>
  );
}

export default App;
