import { generateFilm } from '../mock/film.js';

const FILMS_AMOUNT_DISPLAYED = 5;

export default class FilmsModel {
  films = Array.from({length: FILMS_AMOUNT_DISPLAYED}, generateFilm);

  getFilms = () => this.films;
}
