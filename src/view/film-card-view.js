import { createElement } from '../render.js';
import { humanizeTaskDueDate } from '../utils.js';

const createFilmCardTemplate = (film) => {
  const {
    id,
    comments,
    filmInfo: {
      title,
      totalRating,
      genre,
      poster,
      description,
      runtime,
      release: { date }},
    userDetails: {
      watchlist,
      alreadyWatched,
      favorite
    }
  } = film;

  const getfilmDuration = () => {
    const durationInHour = Math.floor(runtime / 60);
    const restMinutes = runtime % 60;

    return `${durationInHour}h ${restMinutes}m`;
  };

  const releaseDate = (date !== null) ? humanizeTaskDueDate(date, 'YYYY') : '';

  const filmInWatchlistClassName = watchlist ? 'film-card__controls-item--active' : '';
  const alreadyWatchedClassName = alreadyWatched ? 'film-card__controls-item--active' : '';
  const favoriteFilmClassName = favorite ? 'film-card__controls-item--active' : '';

  return (
    `<article class="film-card" data-id="${id}">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${totalRating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${releaseDate}</span>
          <span class="film-card__duration">${getfilmDuration()}</span>
          <span class="film-card__genre">${genre.length > 1 ? genre.join(', '): genre}</span>
        </p>
        <img src="${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${description}</p>
        <span class="film-card__comments">${comments.length} comments</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${filmInWatchlistClassName}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${alreadyWatchedClassName}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteFilmClassName}" type="button">Mark as favorite</button>
      </div>
    </article>`);
};

export default class FilmCardView {
  constructor(film) {
    this.film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this.film);
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
