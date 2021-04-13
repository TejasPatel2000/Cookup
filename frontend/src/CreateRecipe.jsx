import React, { useState } from 'react';
import './CreateRecipe.css';

function CreateRecipe() {
  // return (
  //   <div className="createRecipe">
  //     <button type="button" className="button is-primary">Create Recipe!</button>
  //   </div>
  // );
  const [show, setShow] = useState(false);
  function showModal() {
    setShow(!show);
  }
  return (
    <div className="create-recipe">
      <button type="button" className="button is-primary" onClick={showModal}>Create Recipe!</button>
      {show ? (
        <div className="modal is-active">
          <div className="modal-background" />
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Create Recipe!</p>
              <button type="button" className="delete" aria-label="close" onClick={showModal} />
            </header>
            <section className="modal-card-body">
              <div className="recipe-form">
                <input className="input is-primary" type="text" placeholder="Name" />

                <textarea className="textarea is-primary" placeholder="Description of Recipe..." rows="7" />

                <div className="field is-horizontal">
                  <input className="input is-primary" type="text" placeholder="Servings" />
                  <input className="input is-primary" type="text" placeholder="Prep Time" />
                  <input className="input is-primary" type="text" placeholder="Cook Time" />
                </div>

                <textarea className="textarea is-primary" placeholder="Ingredients... (Separate by comma)" rows="7" />

                <textarea className="textarea is-primary" placeholder="Instructions..." rows="7" />
              </div>
            </section>
            <footer className="modal-card-foot">
              <button type="button" className="button is-success">Upload Recipe</button>
              <button type="button" className="button" onClick={showModal}>Cancel</button>
            </footer>
          </div>
        </div>
      ) : (
        <br />
      )}
    </div>
  );
}

export default CreateRecipe;
