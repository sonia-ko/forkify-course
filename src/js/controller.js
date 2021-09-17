/*
// as a user I want to search for recipes, so that I can find new ideas for meals
Feature: input field to send a request to AP with searched keywords
- display results with paginations
- display recipe with cooking time, servings, ingredients

// as a user, I want to be able to update the number of servings, so  that I can cook a meal for different number of people
change serving functionality: update all ingredients according to the current number of servings

// as a user, I want to bookmark recipes, so that I can review them later
bookmarking functionality: display list of bookmarked recipes

// as a user, I want to be able to create my own recipes, so that I have them all organized in the same app.
- user can upload own recipes
- user recipes will automatically be bookmarked
- user can see their own recipes, not recipes rom other users


// as a user, I want to be able to see my bookmarks and own recipe, when I leave the app and come back later so that I can close the app safely after cooking
store bookmark data in the browser using local storage
on the page load read saved bookmarks fro local storage and display them on a page
*/

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import bookmarksView from './views/bookmarksView';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import { async } from 'regenerator-runtime'; //polyfill async await
import 'core-js/stable'; //polyfill everything else

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlServings = function (newServings) {
  // update the recipe servings (state)
  model.updateServings(newServings);
  // update the recipe view
  recipeView.update(model.state.recipe);
  //
};

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 0) update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());

    // 1)updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) load the recipe
    await model.loadRecipe(id);
    // const { recipe } = model.state;

    // 3) render the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1) get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) load search results
    await model.loadSearchResults(query);

    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    // render the initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // // render NEW results

  // resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultsPage(goToPage));
  // render NEW pagination buttons
  paginationView.render(model.state.search);
};

const conrolAddBookmark = function () {
  // add and remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else if (model.state.recipe.bookmarked) {
    model.deleteBookmark(model.state.recipe.id);
  }
  // update recipe view
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // shw loading spinner
    addRecipeView.renderSpinner;
    console.log(newRecipe);
    // upload new recipe data

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    //recder recipe
    recipeView.render(model.state.recipe);

    // success msg
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change ID in the URL
    window.history.pushState(null, '', `${model.state.recipe.id}`);

    //close form window

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log('🎈', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHendlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(conrolAddBookmark);
  searchView.addHendlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
