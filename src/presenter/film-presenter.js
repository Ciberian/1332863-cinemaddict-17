import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import { UserAction, UpdateType } from '../const.js';
import { render, remove, replace, RenderPosition } from '../framework/render.js';

export default class FilmPresenter {
  #film = null;
  #comments = null;
  #changeData = null;
  #closeAnyOpenPopup = null;
  #filmCardComponent = null;
  #filmPopupComponent = null;
  #currentFilmsContainer = null;

  constructor(comments, changeData, closeAnyOpenPopup, container) {
    this.#comments = comments;
    this.#changeData = changeData;
    this.#currentFilmsContainer = container;
    this.#closeAnyOpenPopup = closeAnyOpenPopup;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(this.#film);
    this.#filmCardComponent.setClickHandler(() => this.#addFilmPopup(this.#film, this.#comments));
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmCardComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);

    if (prevFilmComponent === null) {
      render(this.#filmCardComponent, this.#currentFilmsContainer);
      return;
    }

    if (this.#currentFilmsContainer.contains(prevFilmComponent.element)) {
      replace(this.#filmCardComponent, prevFilmComponent);

      if (document.querySelector('.film-details')) {
        this.#addFilmPopup(this.#film, this.#comments);
      }
    }

    remove(prevFilmComponent);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
  };

  #addFilmPopup = (film, commentsList) => {
    this.#closeAnyOpenPopup();

    const siteFooterElement = document.querySelector('.footer');
    const selectedComments = commentsList.filter(({ id }) => film.comments.some((commentId) => commentId === Number(id)));
    this.#filmPopupComponent = new FilmPopupView(film, selectedComments);

    render(this.#filmPopupComponent, siteFooterElement, RenderPosition.AFTEREND);
    document.body.classList.add('hide-overflow');

    document.addEventListener('keydown', this.#onDocumentKeyDown);
    this.#filmPopupComponent.setClickHandler(this.#onCloseBtnClick);
    this.#filmPopupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmPopupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmPopupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
  };

  removeFilmPopup = () => {
    document.body.classList.remove('hide-overflow');
    remove(this.#filmPopupComponent);
    document.removeEventListener('keydown', this.#onDocumentKeyDown);
  };

  #onCloseBtnClick = () => {
    this.removeFilmPopup();
  };

  #onDocumentKeyDown = (evt) => {
    if (evt.code === 'Escape') {
      evt.preventDefault();
      this.removeFilmPopup();
    }
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film,
        userDetails: {
          favorite: !this.#film.userDetails.favorite,
          alreadyWatched: this.#film.userDetails.alreadyWatched,
          watchlist: this.#film.userDetails.watchlist,
        },
      }
    );
  };

  #handleWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film,
        userDetails: {
          favorite: this.#film.userDetails.favorite,
          alreadyWatched: !this.#film.userDetails.alreadyWatched,
          watchlist: this.#film.userDetails.watchlist,
        },
      }
    );
  };

  #handleWatchlistClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film,
        userDetails: {
          favorite: this.#film.userDetails.favorite,
          alreadyWatched: this.#film.userDetails.alreadyWatched,
          watchlist: !this.#film.userDetails.watchlist,
        },
      },
    );
  };
}
