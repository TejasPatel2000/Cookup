import React, { useState, useRef } from 'react';

export default function CreateTag() {
  const [showNew, setNew] = useState(false);

  const name = useRef(null);

  function showForm() {
    setNew(!showNew);
  }

  async function submitForm() {
    if (name) {
      await fetch('/api/tag/new', {
        methods: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.current.value,
          description: null,
          followers: 0,
          posts: 0,
        }),
      });
    }
  }

  return (
    <div className="create-tag">
      <button type="button" className="button is-primary" onClick={showForm}>Add New Tag</button>
      {showNew ? (
        <div className="field">
          <div className="control">
            <input ref={name} className="input" type="text" placeholder="Name" />
          </div>
          <div className="field">
            <p className="control">
              <input type="submit" value="Submit" className="button is-primary" onClick={submitForm} />
              <button type="button" className="button is-primary" onClick={showForm}>Cancel </button>
            </p>
          </div>
        </div>
      ) : (
        <br />
      )}
    </div>
  );
}
