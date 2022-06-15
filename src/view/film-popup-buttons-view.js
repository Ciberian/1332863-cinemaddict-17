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

  setButtonsClickHandler = (callback, callbackName) => {
    this._callback[callbackName] = callback;
    this.element.querySelector(`.film-details__control-button--${callbackName}`).addEventListener('click', (evt) => this.#buttonsClickHandler(evt, callbackName));
  };

  #buttonsClickHandler = (evt, callbackName) => {
    evt.preventDefault();
    evt.target.disabled = true;
    this._callback[callbackName](evt.target, this.#film);
  };
}
