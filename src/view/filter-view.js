import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const { type, name, count } = filter;

  return `
    <a href="#${type}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}">
      ${name}
      ${type !== 'all' ? `<span class="main-navigation__item-count">${count}</span>` : ''}
    </a>`;
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems.reduce(((filtersTemplate, filter) => filtersTemplate + createFilterItemTemplate(filter, currentFilterType)), '');

  return `
  <nav class="main-navigation">
    ${filterItemsTemplate}
  </nav>`;
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  setFilterControlClickHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterControlClickHandler);
  };

  #filterControlClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt);
  };
}
