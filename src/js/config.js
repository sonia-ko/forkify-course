// challenges:
//- display the number of pages between the pagination buttons - done
// - abitility to sort search results by the duration or the number of ingredients (not available for now)
// - perform the ingredient validation right in the view, before submitting a form
// - improve the ingredient input: separate in multiple fields and allow more than 6 ingredients
// - shopping list feature - button on recipe to add ingredients to the list
// weekly meal feature - assign recipes to the next 7 days and show on a eekly calendar
// get nutrition data on each ingredient from spoonacular API and calculate total clories of recipe

export const API_URL = `https://forkify-api.herokuapp.com/api/v2/recipes/`;
export const TIMEOUT_SEC = 40;
export const RES_PER_PAGE = 10;

export const KEY = '502c6018-4ce8-4feb-9ee1-28b7695a21e0';

export const MODAL_CLOSE_SEC = 2.5;

export let numIngredients = 6;
