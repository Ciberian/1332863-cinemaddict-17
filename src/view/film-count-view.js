import { createElement } from '../render.js';

const createFilmCountTemplate = (filmCount) => `<p>${filmCount} movies inside</p>`;

export default class FilmCountView {
  #element = null;
  #filmCount = null;

  constructor(filmCount) {
    this.#filmCount = filmCount;
  }

  get template() {
    return createFilmCountTemplate(this.#filmCount);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element.remove();
    this.#element = null;
  }
}
