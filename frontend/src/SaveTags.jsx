import React from 'react';

function SaveTags() {
  const tags = ['Vegan', 'Vege'];

  async function onAdd(newTag) {
    if (newTag) {
      await fetch('/api/follow/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          following: newTag,
        }),
      });
    }
  }

  return (
    <div>
      <div className="adding_tag">
        { tags.map((tag) => (
          <button type="button" className="button is-primary is-rounded is-small m-1" onClick={() => { onAdd({ tag }); }}>
            {tag}
            <a className="is-size-5 m-1">+</a>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SaveTags;
