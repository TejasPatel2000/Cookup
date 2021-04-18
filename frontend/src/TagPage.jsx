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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.current.value,
          description: null,
          followers: 0,
        }),
      });
    }
    setNew(!showNew);
  }

  return (
    <div className="create-tag">
      <button type="button" className="button is-primary" onClick={showForm}>Add New Tag</button>
      {showNew ? (
        <div className="modal is-active">
          <div className="modal-background" />
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Add Tag</p>
              <button type="button" className="delete" aria-label="close" onClick={showForm} />
            </header>
            <section className="modal-card-body">
              <div className="field">
                <input ref={name} className="input" type="text" placeholder="Name" />
              </div>
            </section>
            <footer className="modal-card-foot">
              <input type="submit" value="Submit" className="button is-success" onClick={submitForm} />
              <button type="button" className="button" onClick={showForm}>Cancel</button>
            </footer>
          </div>
        </div>
      ) : (
        <br />
      )}
    </div>
  );
}
