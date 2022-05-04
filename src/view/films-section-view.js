import { createElement } from '../render.js';

const createFilmsSectionTemplate = () => '<section class="films"></section>';

export default class FilmsSectionView {
  #element = null;

  get template() {
    return createFilmsSectionTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
