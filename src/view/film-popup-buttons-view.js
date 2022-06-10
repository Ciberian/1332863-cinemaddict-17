import AbstractView from '../framework/view/abstract-view.js';

const createFilmPopupButtonsTemplate = (filmData, isDisabled) => {
  const { userDetails: { watchlist, alreadyWatched, favorite }} = filmData;

  const filmInWatchlistClassName = watchlist ? 'film-details__control-button--active' : '';
  const alreadyWatchedClassName = alreadyWatched ? 'film-details__control-button--active' : '';
  const favoriteFilmClassName = favorite ? 'film-details__control-button--active' : '';

  return `
    <section class="film-details__controls">
      <button type="button" class="film-details__control-button film-details__control-button--watchlist ${filmInWatchlistClassName}" id="watchlist" name="watchlist" ${isDisabled ? 'disabled' : ''}>Add to watchlist</button>
      <button type="button" class="film-details__control-button film-details__control-button--watched ${alreadyWatchedClassName}" id="watched" name="watched" ${isDisabled ? 'disabled' : ''}>Already watched</button>
      <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteFilmClassName}" id="favorite" name="favorite" ${isDisabled ? 'disabled' : ''}>Add to favorites</button>
    </section>`;
};

export default class FilmPopupButtonsView extends AbstractView {
  #film = null;
  #isDisabled = null;

  constructor(film, isDisabled) {
    super();
    this.#film = film;
    this.#isDisabled = isDisabled;
  }

  get template() {
    return createFilmPopupButtonsTemplate(this.#film, this.#isDisabled);
  }

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

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };
}
