import { generateFilm, generateComment } from '../mock/film.js';

const FILMS_AMOUNT = 18;
const COMMENTS_AMOUNT = 10;

export default class FilmsModel {
  #films = Array.from({length: FILMS_AMOUNT}, () => generateFilm(COMMENTS_AMOUNT));
  #comments = Array.from({length: COMMENTS_AMOUNT}, generateComment);

  get films () {
    return this.#films;
  }

  get comments () {
    return this.#comments;
  }
}
