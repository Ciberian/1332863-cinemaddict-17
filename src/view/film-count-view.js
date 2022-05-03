import { createElement } from '../render.js';

const createFilmCountTemplate = () => '<p>130 291 movies inside</p>';

export default class FilmCountView {
  #element = null;

  get template() {
    return createFilmCountTemplate();
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
