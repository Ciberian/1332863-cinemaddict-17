import FilmPopupView from '../view/film-popup-view.js';
import FilmPopupButtonsPresenter from './film-popup-buttons-presenter.js';
import FilmPopupCommentsPresenter from './film-popup-comments-presenter.js';
import { render, remove, RenderPosition } from '../framework/render.js';

export default class FilmPopupPresenter {
  #filmPopupComponent = null;

  init(film, comments, changeData, filmsModel) {
    if (document.body.querySelector('.film-details')) {
      document.body.querySelector('.film-details').remove();
    }
    const siteFooterElement = document.querySelector('.footer');

    this.#filmPopupComponent = new FilmPopupView(film);
    this.#filmPopupComponent.setClickHandler(this.#onCloseBtnClick);
    document.addEventListener('keydown', this.#onDocumentKeyDown);

    const filmPopupButtonsPresenter = new FilmPopupButtonsPresenter(changeData, filmsModel, this.#filmPopupComponent.element, comments);
    const filmPopupCommentsPresenter = new FilmPopupCommentsPresenter();

    render(this.#filmPopupComponent, siteFooterElement, RenderPosition.AFTEREND);
    filmPopupButtonsPresenter.init(film);
    filmPopupCommentsPresenter.init(film, comments, this.#filmPopupComponent.element);
    document.body.classList.add('hide-overflow');
  }

  #removeFilmPopup = () => {
    remove(this.#filmPopupComponent);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onDocumentKeyDown);
  };

  #onCloseBtnClick = () => {
    this.#removeFilmPopup();
  };

  #onDocumentKeyDown = (evt) => {
    if (evt.code === 'Escape') {
      evt.preventDefault();
      this.#removeFilmPopup();
    }
  };
}
