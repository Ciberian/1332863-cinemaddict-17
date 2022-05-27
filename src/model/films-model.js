import Observable from '../framework/observable.js';
import { generateFilm } from '../mock/film.js';

const FILMS_AMOUNT = 18;
const COMMENTS_AMOUNT = 10;

export default class FilmsModel extends Observable {
  #films = Array.from({length: FILMS_AMOUNT}, () => generateFilm(COMMENTS_AMOUNT));

  get films () {
    return this.#films;
  }
}
