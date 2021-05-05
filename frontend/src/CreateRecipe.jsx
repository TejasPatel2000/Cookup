import React, { useRef, useContext, useState } from 'react';
import _uniqueId from 'lodash/uniqueId';
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

  const [thumbs, setThumbs] = useState([]);

  const appContext = useContext(AppContext);
  let contentDict = {};
  if (appContext.editRecipe) {
    contentDict = appContext.recipeContent;
  }

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
          images: thumbs,
        }),
      });
    }
  }

  async function uploadFiles(files) {
    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append(file.name, file);
    });

    const req = await fetch('/api/recipe/images', {
      method: 'POST',
      body: formData,
    });

    const res = await req.json();
    setThumbs(res.uploads);
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
          images: thumbs,
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
            { appContext.editRecipe ? (
              <div>
                <input ref={recipeName} className="input is-primary" type="text" placeholder="Recipe Name" defaultValue={contentDict.name} />
                <textarea ref={description} className="textarea is-primary" placeholder="Description of Recipe..." rows="7" defaultValue={contentDict.description} />
                <div className="field is-horizontal">
                  <input ref={servings} className="input is-primary" type="text" placeholder="Servings" defaultValue={contentDict.servings} />
                  <input ref={prepTime} className="input is-primary" type="text" placeholder="Prep Time (in min)" defaultValue={contentDict.prep_time} />
                  <input ref={cookTime} className="input is-primary" type="text" placeholder="Cook Time (in min)" defaultValue={contentDict.cook_time} />
                </div>
              </div>
            ) : (
              <div>
                <input ref={recipeName} className="input is-primary" type="text" placeholder="Recipe Name" defaultValue="" />
                <textarea ref={description} className="textarea is-primary" placeholder="Description of Recipe..." rows="7" defaultValue="" />
                <div className="field is-horizontal">
                  <input ref={servings} className="input is-primary" type="text" placeholder="Servings" defaultValue="" />
                  <input ref={prepTime} className="input is-primary" type="text" placeholder="Prep Time (in min)" defaultValue="" />
                  <input ref={cookTime} className="input is-primary" type="text" placeholder="Cook Time (in min)" defaultValue="" />
                </div>
              </div>
            )}
            <div className="is-flex is-flex-wrap-nowrap is-flex-direction-row" style={{ overflowX: 'auto' }}>
              {thumbs.map((thumb) => (
                <div
                  key={_uniqueId()}
                  className="is-flex-grow-1 is-flex-shrink-0"
                  style={{
                    maxWidth: '256px', flexBasis: 'auto', margin: '8px', minWidth: '256px',
                  }}
                >
                  <figure className="image is-3by2">
                    <img src={`/api/recipe/image/${thumb}`} alt="recipe preview" />
                  </figure>
                </div>
              ))}
            </div>
            <div className="file has-name is-fullwidth">
              <label className="file-label">
                <input className="file-input" type="file" multiple="multiple" accept="image/*" name="photo" onChange={(e) => { uploadFiles(e.target.files); }} />
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
            { appContext.editRecipe ? (
              <div>
                <textarea ref={ingredients} className="textarea is-primary" placeholder="Ingredients... (Separate by comma)" rows="7" defaultValue={contentDict.ingredients} />
                <textarea ref={instructions} className="textarea is-primary" placeholder="Instructions..." rows="7" defaultValue={contentDict.instructions} />
                <input ref={tags} className="input is-primary" type="text" placeholder="tags (separate by comma)" defaultValue={contentDict.tags} />
              </div>
            ) : (
              <div>
                <textarea ref={ingredients} className="textarea is-primary" placeholder="Ingredients... (Separate by comma)" rows="7" defaultValue="" />
                <textarea ref={instructions} className="textarea is-primary" placeholder="Instructions..." rows="7" defaultValue="" />
                <input ref={tags} className="input is-primary" type="text" placeholder="tags (separate by comma)" defaultValue="" />
              </div>
            )}
          </div>
        </section>
        <footer className="modal-card-foot">
          <input type="submit" value="Submit" className="button is-info" onClick={submitForm} />
          <button type="button" className="button" onClick={() => { appContext.setEditRecipe(false); appContext.setRecipeVisible(false); }}>Cancel</button>
        </footer>
      </div>
    </div>
  );
}

export default CreateRecipe;
