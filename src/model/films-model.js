import { generateFilm, generateComment } from '../mock/film.js';

const FILMS_AMOUNT_DISPLAYED = 10;
const COMMENTS_AMOUNT = 10;

export default class FilmsModel {
  films = Array.from({length: FILMS_AMOUNT_DISPLAYED}, () => generateFilm(COMMENTS_AMOUNT));
  comments = Array.from({length: COMMENTS_AMOUNT}, generateComment);

  getFilms = () => this.films;
  getComments = () => this.comments;
}
