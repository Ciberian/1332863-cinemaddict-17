import FilmCardView from '../view/film-card-view.js';
import FilmPopupPresenter from './film-popup-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { UpdateType } from '../const.js';
import { render, remove, replace } from '../framework/render.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

const SHAKE_CLASS_NAME = 'shake';
const SHAKE_ANIMATION_TIMEOUT = 600;

export default class FilmPresenter {
  #film = null;
  #filmsModel = null;
  #commentsModel = null;
  #filmCardComponent = null;
  #currentFilmsContainer = null;
  #filmPopupPresenter = null;

  constructor(container, filmsModel, commentsModel) {
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#currentFilmsContainer = container;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(this.#film);
    this.#filmPopupPresenter = new FilmPopupPresenter(this.#commentsModel, uiBlocker);
    this.#filmCardComponent.setFilmCardClickHandler(() => this.#filmPopupPresenter.init(this.#film, this.#filmsModel));
    this.#filmCardComponent.setButtonsClickHandler(this.#handleFavoriteClick, 'favorite');
    this.#filmCardComponent.setButtonsClickHandler(this.#handleWatchedClick, 'mark-as-watched');
    this.#filmCardComponent.setButtonsClickHandler(this.#handleWatchlistClick, 'add-to-watchlist');

    if (prevFilmComponent === null) {
      render(this.#filmCardComponent, this.#currentFilmsContainer);
      return;
    }

    if (this.#currentFilmsContainer.contains(prevFilmComponent.element)) {
      replace(this.#filmCardComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
  };

  #shakeButton = (button) => {
    button.classList.add(SHAKE_CLASS_NAME);
    setTimeout(() => {
      button.disabled = false;
      button.classList.remove(SHAKE_CLASS_NAME);
    }, SHAKE_ANIMATION_TIMEOUT);
  };

  #handleFavoriteClick = async (evtTarget) => {
    uiBlocker.block();
    try {
      await this.#filmsModel.updateFilm(UpdateType.MINOR,
        {...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}});
    } catch(err) {
      uiBlocker.unblock();
      this.#shakeButton(evtTarget);
    }
    uiBlocker.unblock();
  };

  #handleWatchedClick = async (evtTarget) => {
    uiBlocker.block();
    try {
      await this.#filmsModel.updateFilm(UpdateType.MINOR,
        {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}});
    } catch(err) {
      uiBlocker.unblock();
      this.#shakeButton(evtTarget);
    }
    uiBlocker.unblock();
  };

  #handleWatchlistClick = async (evtTarget) => {
    uiBlocker.block();
    try {
      await this.#filmsModel.updateFilm(UpdateType.MINOR,
        {...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}});
    } catch(err) {
      uiBlocker.unblock();
      this.#shakeButton(evtTarget);
    }
    uiBlocker.unblock();
  };
}
