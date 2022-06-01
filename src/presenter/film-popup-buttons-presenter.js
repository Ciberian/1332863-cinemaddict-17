import FilmPopupButtonsView from '../view/film-popup-buttons-view.js';
import FilmPopupPresenter from './film-popup-presenter.js';
import { UpdateType } from '../const.js';
import { render, remove, replace } from '../framework/render.js';

export default class FilmPopupButtonsPresenter {
  #comments = null;
  #changeData = null;
  #filmsModel = null;
  #buttonsContainer = null;
  #buttonsComponent = null;
  #prevFilm = null;

  #filmPopupPresenter = new FilmPopupPresenter();

  constructor(changeData, filmsModel, buttonsContainer, comments) {
    this.#comments = comments;
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
        if (updatedFilm.id !== this.#prevFilm.id) {
          this.#filmPopupPresenter.init(updatedFilm, this.#comments, this.#changeData, this.#filmsModel);
        } else {
          this.init(updatedFilm);
        }
        break;
      case UpdateType.MINOR:
        this.init(updatedFilm);
        if (updatedFilm.id !== this.#prevFilm.id) {
          this.#filmPopupPresenter.init(updatedFilm, this.#comments, this.#changeData, this.#filmsModel);
        } else {
          this.init(updatedFilm);
        }
        break;
      case UpdateType.MAJOR:
        this.init(updatedFilm);
        if (updatedFilm.id !== this.#prevFilm.id) {
          this.#filmPopupPresenter.init(updatedFilm, this.#comments, this.#changeData, this.#filmsModel);
        } else {
          this.init(updatedFilm);
        }
        break;
    }
  };

  #handleFavoriteClick = (film) => {
    this.#changeData(
      UpdateType.PATCH,
      {...film,
        userDetails: {
          favorite: !film.userDetails.favorite,
          alreadyWatched: film.userDetails.alreadyWatched,
          watchlist: film.userDetails.watchlist,
        },
      }
    );
  };

  #handleWatchedClick = (film) => {
    this.#changeData(
      UpdateType.PATCH,
      {...film,
        userDetails: {
          favorite: film.userDetails.favorite,
          alreadyWatched: !film.userDetails.alreadyWatched,
          watchlist: film.userDetails.watchlist,
        },
      }
    );
  };

  #handleWatchlistClick = (film) => {
    this.#changeData(
      UpdateType.PATCH,
      {...film,
        userDetails: {
          favorite: film.userDetails.favorite,
          alreadyWatched: film.userDetails.alreadyWatched,
          watchlist: !film.userDetails.watchlist,
        },
      },
    );
  };
}
