
import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import { render, remove, replace } from '../framework/render.js';

export default class FilmPresenter {
  #film = null;
  #comments = null;
  #filmListContainer = null;
  #filmCardComponent = null;
  #filmPopupComponent = null;

  constructor(comments) {
    this.#comments = comments;
  }

  init = (film, container) => {
    this.#film = film;
    this.#filmListContainer = container;

    const prevFilmComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(this.#film);
    this.#filmCardComponent.setClickHandler(() => this.#addFilmPopup(this.#film, this.#comments));

    if (prevFilmComponent === null) {
      render(this.#filmCardComponent, this.#filmListContainer);
      return;
    }

    if (this.#filmListContainer.contains(prevFilmComponent.element)) {
      replace(this.#filmCardComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
  };


  #addFilmPopup = (film, commentsList) => {
    if(this.#filmPopupComponent) {
      this.#removeFilmPopup();
    }

    const siteFooterElement = document.querySelector('.footer');
    const selectedComments = commentsList.filter(({ id }) => film.comments.some((commentId) => commentId === Number(id)));
    this.#filmPopupComponent = new FilmPopupView(film, selectedComments);

    render(this.#filmPopupComponent, siteFooterElement, 'afterend');
    document.body.classList.add('hide-overflow');

    document.addEventListener('keydown', this.#onDocumentKeyDown);
    this.#filmPopupComponent.setClickHandler(this.#onCloseBtnClick);
  };

  #removeFilmPopup = () => {
    document.body.classList.remove('hide-overflow');
    remove(this.#filmPopupComponent);
    document.removeEventListener('keydown', this.#onDocumentKeyDown);
  };

  #onCloseBtnClick = () => {
    this.#removeFilmPopup();
  };

  #onDocumentKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removeFilmPopup();
    }
  };
}
