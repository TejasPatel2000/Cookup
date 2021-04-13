import React, { useState } from 'react';

function GroupsPage() {
  const [isClicked, setClick] = useState(false);
  function showGroups() {
    if (isClicked) {
      return (
        <div>
          <h1>Groups</h1>
        </div>
      );
    }
    return null;
  }
  function showButton() {
    if (!isClicked) {
      return (
        <button type="button" className="button is-primary" onClick={() => { setClick(!isClicked); }}>Go to Groups</button>
      );
    }
    return showGroups();
  }

  return showButton();
}

export default GroupsPage;
