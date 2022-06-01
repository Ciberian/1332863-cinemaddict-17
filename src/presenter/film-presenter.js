import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import CommentsView from '../view/comments-view.js';

import { UpdateType } from '../const.js';
import { render, remove, replace, RenderPosition } from '../framework/render.js';

export default class FilmPresenter {
  #film = null;
  #comments = null;
  #changeData = null;
  #closeAnyOpenPopup = null;
  #filmCardComponent = null;
  #filmPopupComponent = null;
  #filmCommentsComponent = null;
  #prevCommentsComponent = null;
  #currentFilmsContainer = null;

  constructor(comments, changeData, closeAnyOpenPopup, container) {
    this.#comments = comments;
    this.#changeData = changeData;
    this.#currentFilmsContainer = container;
    this.#closeAnyOpenPopup = closeAnyOpenPopup;
  }

  init = (film, scrollPosition) => {
    this.#film = film;

    let isFirstRender = true;
    const prevFilmComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(this.#film);
    this.#filmCardComponent.setClickHandler(() => this.#addFilmPopup(this.#film, this.#comments, isFirstRender, scrollPosition));
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
        isFirstRender = false;
        this.#addFilmPopup(this.#film, this.#comments, isFirstRender, scrollPosition);
      }
    }

    remove(prevFilmComponent);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
  };

  #addFilmPopup = (film, commentsData, isFirstRender, scrollPosition) => {
    this.#closeAnyOpenPopup();

    const siteFooterElement = document.querySelector('.footer');
    const selectedComments = commentsData.filter(({ id }) => film.comments.some((commentId) => commentId === Number(id)));
    this.#filmPopupComponent = new FilmPopupView(film);
    this.#filmCommentsComponent = new CommentsView(selectedComments);

    render(this.#filmPopupComponent, siteFooterElement, RenderPosition.AFTEREND);

    if (isFirstRender) {
      this.#prevCommentsComponent = this.#filmCommentsComponent;
      render(this.#filmCommentsComponent, this.#filmPopupComponent.element);
    } else {
      // console.log(scrollPosition);
      // console.log(this.#prevCommentsComponent);
      render(this.#prevCommentsComponent, this.#filmPopupComponent.element);
      this.#filmPopupComponent.element.scrollTo(0, scrollPosition);
    }
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

  #handleFavoriteClick = (evt) => {
    this.#changeData(
      UpdateType.PATCH,
      {...this.#film,
        userDetails: {
          favorite: !this.#film.userDetails.favorite,
          alreadyWatched: this.#film.userDetails.alreadyWatched,
          watchlist: this.#film.userDetails.watchlist,
        }
      },
      evt.view.pageYOffset
    );
  };

  #handleWatchedClick = (evt) => {
    this.#changeData(
      UpdateType.PATCH,
      {...this.#film,
        userDetails: {
          favorite: this.#film.userDetails.favorite,
          alreadyWatched: !this.#film.userDetails.alreadyWatched,
          watchlist: this.#film.userDetails.watchlist,
        }
      },
      evt.view.pageYOffset
    );
  };

  #handleWatchlistClick = (evt) => {
    this.#changeData(
      UpdateType.PATCH,
      {...this.#film,
        userDetails: {
          favorite: this.#film.userDetails.favorite,
          alreadyWatched: this.#film.userDetails.alreadyWatched,
          watchlist: !this.#film.userDetails.watchlist,
        }
      },
      evt.view.pageYOffset
    );
  };
}
