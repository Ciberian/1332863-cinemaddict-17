import AbstractView from '../framework/view/abstract-stateful-view.js';
import { humanizeFilmDate, getFilmDuration } from '../utils/films.js';

const createFilmPopupTemplate = (filmData) => {
  const {
    filmInfo: {
      title,
      alternativeTitle,
      totalRating,
      ageRating,
      director,
      writers,
      actors,
      genre,
      poster,
      description,
      runtime,
      release: { date, releaseCountry },
    },
    userDetails: { watchlist, alreadyWatched, favorite }
  } = filmData;

  const releaseDate = date !== null ? humanizeFilmDate(date, 'DD MMMM YYYY') : '';
  const filmInWatchlistClassName = watchlist ? 'film-details__control-button--active' : '';
  const alreadyWatchedClassName = alreadyWatched ? 'film-details__control-button--active' : '';
  const favoriteFilmClassName = favorite ? 'film-details__control-button--active' : '';

  const getGenreTemplates = () => genre.reduce((htmlTemplate, gen) => (htmlTemplate += `<span class="film-details__genre">${gen}</span>`), '');

  return `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers.length > 1 ? writers.join(', ') : writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors.length > 1 ? actors.join(', ') : actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${getFilmDuration(runtime)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genre.length > 1 ? 'Genres' : 'Genre'}</td>
                  <td class="film-details__cell">${getGenreTemplates()}</td>
                </tr>
              </table>

              <p class="film-details__film-description">${description}</p>
            </div>
          </div>

          <section class="film-details__controls">
            <button type="button" class="film-details__control-button film-details__control-button--watchlist ${filmInWatchlistClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" class="film-details__control-button film-details__control-button--watched ${alreadyWatchedClassName}" id="watched" name="watched">Already watched</button>
            <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteFilmClassName}" id="favorite" name="favorite">Add to favorites</button>
          </section>
        </div>
      </form>
  </section>`;
};

export default class FilmPopupView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmPopupTemplate(this.#film);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #favoriteClickHandler = (evt) => {
    // console.log(evt.view);
    // console.log(evt.view.pageYOffset);
    evt.preventDefault();
    this._callback.favoriteClick(evt);
    this.element.querySelector('.film-details__control-button--favorite').classList.toggle('film-details__control-button--active');
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick(evt);
    this.element.querySelector('.film-details__control-button--watched').classList.toggle('film-details__control-button--active');
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick(evt);
    this.element.querySelector('.film-details__control-button--watchlist').classList.toggle('film-details__control-button--active');
  };
}
