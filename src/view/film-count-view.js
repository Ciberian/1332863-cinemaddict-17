import AbstractView from '../framework/view/abstract-view.js';

const createFilmCountTemplate = (filmCount) => `<p>${filmCount} movies inside</p>`;

export default class FilmCountView extends AbstractView {
  #filmCount = null;

  constructor(filmCount) {
    super();
    this.#filmCount = filmCount;
  }

  get template() {
    return createFilmCountTemplate(this.#filmCount);
  }
}
