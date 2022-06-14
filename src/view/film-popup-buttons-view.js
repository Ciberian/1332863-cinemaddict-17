import AbstractView from '../framework/view/abstract-view.js';

const createFilmPopupButtonsTemplate = (filmData) => {
  const { userDetails: { watchlist, alreadyWatched, favorite }} = filmData;

  const setActiveClass = (userDetail) => userDetail ? 'film-details__control-button--active' : '';

  return `
    <section class="film-details__controls">
      <button type="button" class="film-details__control-button film-details__control-button--watchlist ${setActiveClass(watchlist)}" id="watchlist" name="watchlist"}>Add to watchlist</button>
      <button type="button" class="film-details__control-button film-details__control-button--watched ${setActiveClass(alreadyWatched)}" id="watched" name="watched"}>Already watched</button>
      <button type="button" class="film-details__control-button film-details__control-button--favorite ${setActiveClass(favorite)}" id="favorite" name="favorite"}>Add to favorites</button>
    </section>`;
};

export default class FilmPopupButtonsView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmPopupButtonsTemplate(this.#film);
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
    evt.target.disabled = true;
    this._callback.favoriteClick(evt.target, this.#film);
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    evt.target.disabled = true;
    this._callback.watchedClick(evt.target, this.#film);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    evt.target.disabled = true;
    this._callback.watchlistClick(evt.target, this.#film);
  };
}
