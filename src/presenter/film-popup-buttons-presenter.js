import FilmPopupButtonsView from '../view/film-popup-buttons-view.js';
import { UpdateType } from '../const.js';
import { render, remove, replace } from '../framework/render.js';

const SHAKE_CLASS_NAME = 'shake';
const SHAKE_ANIMATION_TIMEOUT = 600;

export default class FilmPopupButtonsPresenter {
  #filmsModel = null;
  #container = null;
  #buttonsComponent = null;
  #prevFilm = null;


  constructor(filmsModel, container) {
    this.#filmsModel = filmsModel;
    this.#container = container;

    this.#filmsModel.addObserver(this.#handlePopupButtonsModelEvent);
  }

  init = (film) => {
    this.#prevFilm = film;
    const prevButtonsComponent = this.#buttonsComponent;

    this.#buttonsComponent = new FilmPopupButtonsView(film);

    this.#buttonsComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#buttonsComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#buttonsComponent.setWatchlistClickHandler(this.#handleWatchlistClick);

    if (prevButtonsComponent === null) {
      render(this.#buttonsComponent, this.#container.querySelector('.film-details__top-container'));
      return;
    }

    if (this.#container.contains(prevButtonsComponent.element)) {
      replace(this.#buttonsComponent, prevButtonsComponent);
    }

    remove(prevButtonsComponent);
  };

  destroy = () => {
    remove(this.#buttonsComponent);
  };

  #handlePopupButtonsModelEvent = (updateType, updatedFilm) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#prevFilm.id === updatedFilm.id) {
          this.init(updatedFilm);
        }
        break;
      case UpdateType.MINOR:
        if (this.#prevFilm.id === updatedFilm.id) {
          this.init(updatedFilm);
        }
        break;
      case UpdateType.MAJOR:
        if (this.#prevFilm.id === updatedFilm.id) {
          this.init(updatedFilm);
        }
        break;
    }
  };

  #shakeButton = (button) => {
    button.classList.add(SHAKE_CLASS_NAME);
    setTimeout(() => {
      button.disabled = false;
      button.classList.remove(SHAKE_CLASS_NAME);
    }, SHAKE_ANIMATION_TIMEOUT);
  };

  #handleFavoriteClick = async (evtTarget, film) => {
    try {
      await this.#filmsModel.updateFilm(UpdateType.MINOR,
        {...film, userDetails: {...film.userDetails, favorite: !film.userDetails.favorite}});
    } catch(err) {
      this.#shakeButton(evtTarget);
    }
  };

  #handleWatchedClick = async (evtTarget, film) => {
    try {
      await this.#filmsModel.updateFilm(UpdateType.MINOR,
        {...film, userDetails: {...film.userDetails, alreadyWatched: !film.userDetails.alreadyWatched}});
    } catch(err) {
      this.#shakeButton(evtTarget);
    }
  };

  #handleWatchlistClick = async (evtTarget, film) => {
    try {
      await this.#filmsModel.updateFilm(UpdateType.MINOR,
        {...film, userDetails: {...film.userDetails, watchlist: !film.userDetails.watchlist}});
    } catch(err) {
      this.#shakeButton(evtTarget);
    }
  };
}
