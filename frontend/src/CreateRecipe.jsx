import React, { useRef, useContext } from 'react';
import AppContext from './AppContext';

function CreateRecipe() {
  const recipeName = useRef(null);
  const description = useRef(null);
  const servings = useRef(null);
  const prepTime = useRef(null);
  const cookTime = useRef(null);
  const ingredients = useRef(null);
  const instructions = useRef(null);
  const tags = useRef(null);

  const appContext = useContext(AppContext);

  async function editRecipe() {
    if (recipeName && description) {
      await fetch('/api/recipe/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: appContext.recipeID,
          name: recipeName.current.value,
          description: description.current.value,
          servings: servings.current.value,
          prep_time: prepTime.current.value,
          cook_time: cookTime.current.value,
          ingredients: ingredients.current.value.split(','),
          instructions: instructions.current.value,
          tags: tags.current.value.split(','),
        }),
      });
    }
  }

  async function uploadFiles(files) {
    const formData = new FormData();

    console.log(files);

    Array.from(files).forEach((file) => {
      formData.append(file.name, file);
    });

    const req = await fetch('/api/recipe/images', {
      method: 'POST',
      body: formData,
    });

    const res = await req.json();
    console.log(res);
  }

  async function submitForm() {
    if (appContext.editRecipe) {
      await editRecipe();
    }
    if (recipeName && description && !appContext.editRecipe) {
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
          ingredients: ingredients.current.value.split(','),
          instructions: instructions.current.value,
          tags: tags.current.value.split(','),
        }),
      });
    }
    appContext.setEditRecipe(false);
    appContext.setRecipeVisible(false);
  }

  return (
    <div className={`modal ${appContext.recipeVisible ? 'is-active' : ''}`}>
      <div className="modal-background" />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Create Recipe!</p>
          <button type="button" className="delete" aria-label="close" onClick={() => { appContext.setEditRecipe(false); appContext.setRecipeVisible(false); }} />
        </header>
        <section className="modal-card-body">
          <div className="recipe-form">
            <input ref={recipeName} className="input is-primary" type="text" placeholder="Recipe Name" />
            <textarea ref={description} className="textarea is-primary" placeholder="Description of Recipe..." rows="7" />
            <div className="field is-horizontal">
              <input ref={servings} className="input is-primary" type="text" placeholder="Servings" />
              <input ref={prepTime} className="input is-primary" type="text" placeholder="Prep Time (in min)" />
              <input ref={cookTime} className="input is-primary" type="text" placeholder="Cook Time (in min)" />
            </div>
            { !appContext.editRecipe ? (
              <div className="file has-name is-fullwidth">
                <label className="file-label">
                  <input className="file-input" type="file" name="photo" onChange={(e) => { uploadFiles(e.target.files); }} />
                  <span className="file-cta">
                    <span className="file-icon">
                      <i className="fas fa-upload" />
                    </span>
                    <span className="file-label">
                      Upload…
                    </span>
                  </span>
                  <span className="file-name">
                    Select an image from your device (jpg, jpeg, png, gif)
                  </span>
                </label>
              </div>
            ) : null }
            <textarea ref={ingredients} className="textarea is-primary" placeholder="Ingredients... (Separate by comma)" rows="7" />
            <textarea ref={instructions} className="textarea is-primary" placeholder="Instructions..." rows="7" />
            <input ref={tags} className="input is-primary" type="text" placeholder="tags (separate by comma)" />
          </div>
        </section>
        <footer className="modal-card-foot">
          <input type="submit" value="Submit" className="button is-success" onClick={submitForm} />
          <button type="button" className="button" onClick={() => { appContext.setEditRecipe(false); appContext.setRecipeVisible(false); }}>Cancel</button>
        </footer>
      </div>
    </div>
  );
}

export default CreateRecipe;
