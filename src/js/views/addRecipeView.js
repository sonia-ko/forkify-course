import View from './view.js';
import { numIngredients } from '../config.js';
import 'core-js/stable'; //polyfill everything else
import icons from '../../img/icons.svg'; //parcel 1

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'recipe was successfully uploaded';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _ingredientsColumn = document.querySelector('.ing-upload-column');
  initialNumberOfIngredients = numIngredients;
  additionalIngrds = document.querySelector('.additional-ingredients');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
    if (!this._window.classList.contains('hidden')) {
      this._parentElement.innerHTML = this._generateMarkup(
        this.initialNumberOfIngredients
      );
    }
  }
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];

      const data = Object.fromEntries(dataArr);
      console.log(data);
      handler(data);
    });
  }

  addHandlerAddIngredient(handler) {
    this._parentElement.addEventListener('click', function (e) {
      if (e.target.classList.contains('add-ing-btn')) {
        handler();
      }
    });
  }

  addIngredient(number) {
    const newMarkup = this._generateMarkup(number);

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    console.log(newElements);
    console.log(curElements);

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // update changed text
      if (
        !newEl.isEqualNode(curEl) &&
        // prettier-ignore
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }
      // update changed attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _generateIngredientInputs(numOfIngrds) {
    console.log(numOfIngrds);
    let markup = '';
    for (let i = 1; i <= numOfIngrds; i++) {
      markup =
        markup +
        `<div class="ing-name">Ingredient ${i}</div>
      <div class="ingredient-field">
        <div class="ing-subfield">
              <input
            class="input-inline input-ing-${i}"
            type="text"
            required
            name="ingredient-${i}-name"
            value="avocado"
            placeholder="Product"
          />
        </div>
        <div class="ing-subfield">
          <input
            class="input-inline"
            type="number"
            value="1"
            name="ingredient-${i}-quantity"
            placeholder="Quantity"
          />
        </div>
        <div class="ing-subfield">
          <input
            class="input-inline"
            type="text"
            value="shtuka"
            name="ingredient-${i}-unit"
            placeholder="Unit"
          />
        </div>
      </div>`;
    }

    return markup;
  }
  _generateMarkup(numOfIngrds) {
    return `<div class="upload__column">
    <h3 class="upload__heading">Recipe data</h3>
    <label>Title</label>
    <input value="TEST" required name="title" type="text" />
    <label>URL</label>
    <input
      value="https://test.com/"
      required
      name="sourceUrl"
      type="text"
    />
    <label>Image URL</label>
    <input value="https://test.com/" required name="image" type="text" />
    <label>Publisher</label>
    <input value="TEST" required name="publisher" type="text" />
    <label>Prep time</label>
    <input value="23" required name="cookingTime" type="number" />
    <label>Servings</label>
    <input value="23" required name="servings" type="number" />
  </div>

  <div class="upload__column ing-upload-column">
    <h3 class="upload__heading">Ingredients</h3>

    ${this._generateIngredientInputs(numOfIngrds)}

 
    </div>
     
    

  <button class="btn upload__btn">
    <svg>
      <use href="src/img/icons.svg#icon-upload-cloud"></use>
    </svg>
    <span>Upload</span>
  </button>`;
  }
}

export default new AddRecipeView();
