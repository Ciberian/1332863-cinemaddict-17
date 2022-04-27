import { createElement } from '../render.js';

const createFilmCountTemplate = () => '<p>130 291 movies inside</p>';

export default class FilmCountView {
  getTemplate() {
    return createFilmCountTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
