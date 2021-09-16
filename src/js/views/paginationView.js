import View from './view.js';
import { async } from 'regenerator-runtime'; //polyfill async await
import 'core-js/stable'; //polyfill everything else
import icons from '../../img/icons.svg'; //parcel 1

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  // _errorMessage = 'No recipes found for your query, please try again';
  // _message = '';

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      console.log(goToPage);
      handler(goToPage);
    });
  }
  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    const numPagesEl = `<div class="totalPagesContainer"> <div class="totalPagesEl" >Total pages: ${numPages} </div> </div> `;

    const currentPage = this._data.page;
    console.log(numPages);
    // Page 1 and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return (
        numPagesEl +
        `
            <button data-goto="${
              currentPage + 1
            }" class="btn--inline pagination__btn--next">
            <span>Page  ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button> 
          `
      );
    }

    // We are on the last page
    if (currentPage === numPages && numPages > 1) {
      return (
        numPagesEl +
        `  <button data-goto="${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>`
      );
    }
    // We are on the other page
    if (currentPage < numPages) {
      return (
        numPagesEl +
        `<button data-goto="${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page  ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button> 
          <button data-goto="${
            currentPage - 1
          }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>
           `
      );
    }
    // Page 1 and there are no other pages
    return numPagesEl;
  }
}

export default new PaginationView();
