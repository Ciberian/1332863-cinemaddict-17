import FilmCardView from '../view/film-card-view.js';
import FilmPopupPresenter from './film-popup-presenter.js';
import { UpdateType } from '../const.js';
import { render, remove, replace } from '../framework/render.js';

export default class FilmPresenter {
  #film = null;
  #filmsModel = null;
  #changeData = null;
  #filmCardComponent = null;
  #currentFilmsContainer = null;
  #filmPopupPresenter = new FilmPopupPresenter();

  constructor(changeData, container, filmsModel) {
    this.#filmsModel = filmsModel;
    this.#changeData = changeData;
    this.#currentFilmsContainer = container;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(this.#film);
    this.#filmCardComponent.setClickHandler(() => this.#filmPopupPresenter.init(this.#film, this.#changeData, this.#filmsModel));
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmCardComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);

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

  #handleFavoriteClick = () => {
    this.#changeData(
      UpdateType.MINOR,
      {...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}});
  };

  #handleWatchedClick = () => {
    this.#changeData(
      UpdateType.MINOR,
      {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}});
  };

  #handleWatchlistClick = () => {
    this.#changeData(
      UpdateType.MINOR,
      {...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}});
  };
}
