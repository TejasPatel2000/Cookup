/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */

import React, { useContext } from 'react';
import AppContext from './AppContext';

function AboutModal() {
  const appContext = useContext(AppContext);

  return (
    <div className={`modal ${appContext.aboutVisible ? 'is-active' : ''}`}>
      <div className="modal-background" />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">About our Project!</p>
          <button type="button" className="delete" aria-label="close" onClick={() => { appContext.setAboutVisible(false); }} />
        </header>
        <section className="modal-card-body">
          <div className="content">
            <h3 className="title">Functionality?</h3>
            <p>This app composes of 5 main functionalities:</p>
            <dl>
              <dt>Login Functionality</dt>
              <dd>
                The first major functionality is the login functionality.
                When the user first logs in, they will notice the recipe feed
                that has already been curated by other users, however they will
                not be able to react to anything or use any of the main other
                functionality without actually logging in.
                The login functionality utilized authentication by phone number,
                whether it be for registration or logging in. This was accomplished
                using Twilio. To login/register you need to click on the button on the
                top of the webpage that says &#39;Sign Up&#39;. From there you can either login
                or register, where you just need to fill out the necessary information.
                Once you enter your phone number, you need to click the &#39;Send Code&#39;
                button and from there you will receive a 6 digit code that you will
                need to enter to either login or sign-up.
              </dd>
              <dt>Create Recipe Functionality</dt>
              <dd>
                The next big functionality is being able to create a recipe. This option becomes
                available once you login. There is a &#39;Create Recipe&#39; button at the top
                of the page that will appear. Once you click on that button, there will be a
                pop up with different input fields, however the only required fields are the name and description. 
                Once you have filled out everything you can click the submit button.
                Once you submit, to see your recipe, you will need
                to refresh the page, and your recipe will appear at the top.
              </dd>
              <dt>Search Functionality</dt>
              <dd>
                The search functionality allows a user to easily find a recipe they are searching
                for. The search bar is also at the top of the page. A user can search for either
                recipe name, tag, description, ingredients, or instructions.
              </dd>
              <dt>Tag Functionality</dt>
              <dd>
                The tag functionality allows users to follow specific recipes that they especially
                have an interest in. For example, if you want to see only gluten free recipes, you
                can follow the gluten free tag, and when you click on that tag under followed tags,
                you will only see recipes that have the gluten free tag on them.
              </dd>
              <dt>Social Functionality</dt>
              <dd>
                Another major functionality is the social aspect to our web application. The social
                functionality includes being able to like posts as well as comment on posts.
              </dd>
            </dl>
            <h3 className="title">Why it matters?</h3>
            <p>
              CookUp matters because we have all found that many recipe web
              applications are not a cohesive unit.
              This means that there is always some feature that is lacking.
              For example, many recipe websites will give you just straight recipes
              from a list that they have curated,
              meaning that it is missing the feature of users being able to
              submit their own recipes. In addition, there is a
              social aspect missing from creating recipes
              whether it is being able to like a post, or being able to follow certain tags in a
              recipe (vegetarian, gluten-free, etc...)
              CookUp was designed to resolve these issues.
              This application was designed to resolve all of that.
              By being able to parse through user-curated recipes, 
              any user can find what they are looking for with the additional
              social aspect.
            </p>
            <h3 className="title">Who is it made by?</h3>
            <p>This app was created by:</p>
            <ul>
              <li>Soojin Ahn</li>
              <li>Teslim Olunlade</li>
              <li>Tejas Patel</li>
              <li>Nicholas Stewart</li>
            </ul>
          </div>
        </section>
        <footer className="modal-card-foot">
          <button type="button" className="button" onClick={() => { appContext.setAboutVisible(false); }}>Close</button>
        </footer>
      </div>
    </div>
  );
}

export default AboutModal;
