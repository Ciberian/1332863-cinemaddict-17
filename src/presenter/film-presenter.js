
import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import { render, remove } from '../framework/render.js';

let filmPopupComponent;

const addFilmPopup = (film, commentsList) => {
  if(filmPopupComponent) {
    removeFilmPopup();
  }

  const siteFooterElement = document.querySelector('.footer');
  const selectedComments = commentsList.filter(({ id }) => film.comments.some((commentId) => commentId === Number(id)));
  filmPopupComponent = new FilmPopupView(film, selectedComments);

  render(filmPopupComponent, siteFooterElement, 'afterend');
  document.body.classList.add('hide-overflow');

  document.addEventListener('keydown', onDocumentKeyDown);
  filmPopupComponent.setClickHandler(onCloseBtnClick);
};

function removeFilmPopup() {
  document.body.classList.remove('hide-overflow');
  remove(filmPopupComponent);
  document.removeEventListener('keydown', onDocumentKeyDown);
}

function onCloseBtnClick() {
  removeFilmPopup();
}

function onDocumentKeyDown(evt) {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    evt.preventDefault();
    removeFilmPopup();
  }
}

export default class FilmPresenter {
  #film = null;
  #comments = null;
  #filmListContainer = null;

  constructor(comments) {
    this.#comments = comments;
  }

  init = (film, container) => {
    this.#film = film;
    this.#filmListContainer = container;

    const filmCardComponent = new FilmCardView(this.#film);
    filmCardComponent.setClickHandler(() => addFilmPopup(this.#film, this.#comments));
    render(filmCardComponent, this.#filmListContainer);
  };
}
