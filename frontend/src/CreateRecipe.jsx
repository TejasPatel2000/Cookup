import React, { useState, useRef } from 'react';
import './CreateRecipe.css';

function CreateRecipe() {
  const [show, setShow] = useState(false);

  const recipeName = useRef(null);
  const description = useRef(null);
  const servings = useRef(null);
  const prepTime = useRef(null);
  const cookTime = useRef(null);
  const ingredients = useRef(null);
  const instructions = useRef(null);

  function showModal() {
    setShow(!show);
  }

  async function submitForm() {
    if (recipeName && description) {
      await fetch('/api/recipe/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: recipeName.current.value,
          description: description.current.value,
          servings: servings.current.value,
          prep_time: prepTime.current.value,
          cook_time: cookTime.current.value,
          ingredients: ingredients.current.value,
          instructions: instructions.current.value,
        }),
      });
    }
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
                <input ref={recipeName} className="input is-primary" type="text" placeholder="Recipe Name" />
                <textarea ref={description} className="textarea is-primary" placeholder="Description of Recipe..." rows="7" />
                <div className="field is-horizontal">
                  <input ref={servings} className="input is-primary" type="text" placeholder="Servings" />
                  <input ref={prepTime} className="input is-primary" type="text" placeholder="Prep Time" />
                  <input ref={cookTime} className="input is-primary" type="text" placeholder="Cook Time" />
                </div>
                <textarea ref={ingredients} className="textarea is-primary" placeholder="Ingredients... (Separate by comma)" rows="7" />
                <textarea ref={instructions} className="textarea is-primary" placeholder="Instructions..." rows="7" />
              </div>
            </section>
            <footer className="modal-card-foot">
              <input type="submit" value="Submit" className="button is-success" onClick={submitForm} />
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