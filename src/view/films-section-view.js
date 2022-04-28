import { createElement } from '../render.js';

const createFilmsSectionTemplate = () => '<section class="films"></section>';

export default class FilmsSectionView {
  getTemplate() {
    return createFilmsSectionTemplate();
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
