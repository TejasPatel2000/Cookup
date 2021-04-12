import React, { useState } from 'react';
import AppContext from './AppContext';
import LoginModal from './LoginModal';

function App() {
  const [profile, setProfile] = useState({});

  return (
    <AppContext.Provider value={{ profile, setProfile }}>
      <div>
        <LoginModal />
        <p>{profile.username}</p>
        <p>{profile.fullName}</p>
      </div>
    </AppContext.Provider>
  );
}

export default App;
