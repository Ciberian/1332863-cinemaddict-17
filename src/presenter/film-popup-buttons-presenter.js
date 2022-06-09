import FilmPopupButtonsView from '../view/film-popup-buttons-view.js';
import { UpdateType } from '../const.js';
import { render, remove, replace } from '../framework/render.js';

export default class FilmPopupButtonsPresenter {
  #changeData = null;
  #filmsModel = null;
  #buttonsContainer = null;
  #buttonsComponent = null;
  #prevFilm = null;


  constructor(changeData, filmsModel, buttonsContainer) {
    this.#changeData = changeData;
    this.#filmsModel = filmsModel;
    this.#buttonsContainer = buttonsContainer;

    this.#filmsModel.addObserver(this.#handlePopupButtonsModelEvent);
  }

  init = (film) => {
    this.#prevFilm = film;
    const prevButtonsComponent = this.#buttonsComponent;

    this.#buttonsComponent = new FilmPopupButtonsView(film);

    this.#buttonsComponent.setFavoriteClickHandler(() => this.#handleFavoriteClick(film));
    this.#buttonsComponent.setWatchedClickHandler(() => this.#handleWatchedClick(film));
    this.#buttonsComponent.setWatchlistClickHandler(() => this.#handleWatchlistClick(film));

    if (prevButtonsComponent === null) {
      render(this.#buttonsComponent, this.#buttonsContainer);
      return;
    }

    if (this.#buttonsContainer.contains(prevButtonsComponent.element)) {
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

  #handleFavoriteClick = (film) => {
    this.#changeData(
      UpdateType.MINOR,
      {...film, userDetails: {...film.userDetails, favorite: !film.userDetails.favorite}});
  };

  #handleWatchedClick = (film) => {
    this.#changeData(
      UpdateType.MINOR,
      {...film, userDetails: {...film.userDetails, alreadyWatched: !film.userDetails.alreadyWatched}});
  };

  #handleWatchlistClick = (film) => {
    this.#changeData(
      UpdateType.MINOR,
      {...film, userDetails: {...film.userDetails, watchlist: !film.userDetails.watchlist}});
  };
}
