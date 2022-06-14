import AbstractView from '../framework/view/abstract-view.js';
import { humanizeFilmDate, getFilmDuration } from '../utils/films.js';

const MAX_DESCRIPTION_LENGTH = 140;

const createFilmCardTemplate = (film) => {
  const {
    comments,
    filmInfo: {
      title,
      totalRating,
      genre,
      poster,
      description,
      runtime,
      release: { date },
    },
    userDetails: { watchlist, alreadyWatched, favorite },
  } = film;

  const releaseDate = date !== null ? humanizeFilmDate(date, 'YYYY') : '';
  const filmInWatchlistClassName = watchlist ? 'film-card__controls-item--active' : '';
  const alreadyWatchedClassName = alreadyWatched ? 'film-card__controls-item--active' : '';
  const favoriteFilmClassName = favorite ? 'film-card__controls-item--active' : '';

  const getCertainLengthDescription = () => (description.length > MAX_DESCRIPTION_LENGTH) ? `${description.slice(0, MAX_DESCRIPTION_LENGTH)}...` : description;

  return `<article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${totalRating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${releaseDate}</span>
          <span class="film-card__duration">${getFilmDuration(runtime)}</span>
          <span class="film-card__genre">${genre.length > 1 ? genre.join(', ') : genre}</span>
        </p>
        <img src="${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${getCertainLengthDescription()}</p>
        <span class="film-card__comments">${comments.length} comments</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${filmInWatchlistClassName}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${alreadyWatchedClassName}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteFilmClassName}" type="button">Mark as favorite</button>
      </div>
    </article>`;
};

export default class FilmCardView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  setFilmCardClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#filmCardClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  #filmCardClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    evt.target.disabled = true;
    this._callback.favoriteClick(evt.target);
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    evt.target.disabled = true;
    this._callback.watchedClick(evt.target);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    evt.target.disabled = true;
    this._callback.watchlistClick(evt.target);
  };
}
