import React from 'react';
import './CreateRecipe.css';

function CreateRecipe() {
  // function handleClick() {
  //   const modal = document.querySelector('.modal');
  //   const closeBtn = document.querySelector('.close');
  //   modal.style.display = 'block';
  //   closeBtn.addEventListener('click', () => {
  //     modal.style.display = 'none';
  //   });
  // }

  return (
    <div className="createRecipe">
      <div className="modal">
        <div className="modal-background">title!</div>
        <div className="modal-content">
          Hellow!
        </div>
        <button type="button" className="button is-primary is-large modal-button" aria-label="close">Create Recipe!</button>
      </div>
    </div>
  );

  // return (
  //   <div className="createRecipe">
  // <button type="button" className="createButton" onClick={handleClick}> Create Recipe! </button>
  //     <div className="modal">
  //       <div className="modal_content">
  //         <span className="close">&times;</span>
  //         <p>I am A Pop Up!!!</p>
  //       </div>
  //     </div>
  //   </div>
  // );
}

export default CreateRecipe;
