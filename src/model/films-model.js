import Observable from '../framework/observable.js';
import { generateFilm } from '../mock/film.js';

const FILMS_AMOUNT = 18;
const COMMENTS_AMOUNT = 10;

export default class FilmsModel extends Observable {
  #films = Array.from({length: FILMS_AMOUNT}, () => generateFilm(COMMENTS_AMOUNT));

  get films () {
    return this.#films;
  }

  updateFilm = (updateType, update, scrollPosition) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, update, scrollPosition);
  };
}
