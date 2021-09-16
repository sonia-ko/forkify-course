import View from './view.js';
import { async } from 'regenerator-runtime'; //polyfill async await
import 'core-js/stable'; //polyfill everything else

class SearchView extends View {
    _parentElement = document.querySelector('.search');

    getQuery() {
        const query = this._parentElement.querySelector('.search__field').value;
        this._clearInput();
        return query;
    }

    _clearInput() {
        this._parentElement.querySelector('.search__field').value = '';
    }

    addHendlerSearch(handler) {
        this._parentElement.addEventListener('submit', function(e) {
            e.preventDefault();
            handler();
        });
    }
}

export default new SearchView();