import FilmPopupButtonsView from '../view/film-popup-buttons-view.js';
import { UpdateType } from '../const.js';
import { render, remove, replace } from '../framework/render.js';

export default class FilmPopupButtonsPresenter {
  #filmsModel = null;
  #buttonsContainer = null;
  #buttonsComponent = null;
  #prevFilm = null;


  constructor(filmsModel, buttonsContainer) {
    this.#filmsModel = filmsModel;
    this.#buttonsContainer = buttonsContainer;

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

  #handleFavoriteClick = async (evt, film) => {
    try {
      await this.#filmsModel.updateFilm(UpdateType.MINOR, {...film, userDetails: {...film.userDetails, favorite: !film.userDetails.favorite}});
    } catch(err) {
      evt.target.disabled = false;
      // анимация встряски кнопки
      throw new Error('Can\'t update film');
    }
  };

  #handleWatchedClick = async (evt, film) => {
    try {
      await this.#filmsModel.updateFilm(UpdateType.MINOR,
        {...film, userDetails: {...film.userDetails, alreadyWatched: !film.userDetails.alreadyWatched}});
    } catch(err) {
      evt.target.disabled = false;
      // анимация встряски кнопки
      throw new Error('Can\'t update film');
    }
  };

  #handleWatchlistClick = async (evt, film) => {
    try {
      await this.#filmsModel.updateFilm(UpdateType.MINOR,
        {...film, userDetails: {...film.userDetails, watchlist: !film.userDetails.watchlist}});
    } catch(err) {
      evt.target.disabled = false;
      // анимация встряски кнопки
      throw new Error('Can\'t update film');
    }
  };
}
