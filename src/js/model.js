import { async } from 'regenerator-runtime/';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';
import { RES_PER_PAGE, KEY } from './config';
import { API_URL } from './config.js';
import { numIngredients } from './config.js';
// import { values } from 'core-js/core/array';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
  numberOfIngrredients: numIngredients,
};

const createRecipeObj = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceURL: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}`);

    state.recipe = createRecipeObj(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
    // console.log(state.recipe);
  } catch (err) {
    //temp error handling
    console.error(`${err} ⚠`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    console.log(state.search.results);
    state.search.page = 1;
  } catch {
    console.error(`${err} ⚠`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; //0
  const end = page * state.search.resultsPerPage; //9

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // 2 apples for 4 people
    // 8 people/
    // 2* 8 / 4
    // 2 / 4 * 8
    // newQt = oldQt * newServings / oldServings
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const addBookmark = function (recipe) {
  // add bookmark
  state.bookmarks.push(recipe);

  // mark current recipe as bookmark
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // delete bookmarked
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // mark current recipe as NOT bookmark
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) {
    state.bookmarks = JSON.parse(storage);
  }
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// console.log(state.bookmarks);
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingrds = Object.entries(newRecipe).filter(
      entry => entry[0].startsWith('ingredient') && entry[1] !== ''
    );
    const newArr = [];

    for (let i = 1; i <= numIngredients; i++) {
      const ingObj = {};

      const ingEl = ingrds.filter(entry =>
        entry[0].startsWith(`ingredient-${i}`)
      );

      if (ingEl.length === 0) continue;

      const descrp = ingEl.find(el => el[0].startsWith(`ingredient-${i}-name`));
      ingObj.description = descrp ? descrp[1] : '';

      const unit = ingEl.find(el => el[0].startsWith(`ingredient-${i}-unit`));
      ingObj.unit = unit ? unit[1] : '';

      const quantity = ingEl.find(el =>
        el[0].startsWith(`ingredient-${i}-quantity`)
      );
      ingObj.quantity = quantity ? Number(quantity[1]) : 0;

      newArr.push(ingObj);
    }

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients: newArr,
    };

    console.log(recipe);

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObj(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
