import FilmPopupView from '../view/film-popup-view.js';
import FilmPopupButtonsPresenter from './film-popup-buttons-presenter.js';
import FilmPopupCommentsPresenter from './film-popup-comments-presenter.js';
import FilmsApiService from '../films-api-service.js';
import CommentsModel from '../model/comments-model.js';
import { render, remove, RenderPosition } from '../framework/render.js';

const AUTHORIZATION = 'Basic aV9dsF09wcl9lj8h';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict/';

export default class FilmPopupPresenter {
  #commentsModel = new CommentsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
  #filmPopupComponent = null;
  #comments = null;

  init(film, changeData, filmsModel) {
    this.#commentsModel.init(film).
      then(() => {
        this.#comments = this.#commentsModel.comments;
      }).
      then(() => new FilmPopupCommentsPresenter(film, this.#filmPopupComponent.element, this.#commentsModel)).
      then((filmPopupCommentsPresenter) => filmPopupCommentsPresenter.init(this.#comments));

    if (document.body.querySelector('.film-details')) {
      document.body.querySelector('.film-details').remove();
    }
    const siteFooterElement = document.querySelector('.footer');

    this.#filmPopupComponent = new FilmPopupView(film);
    this.#filmPopupComponent.setClickHandler(this.#onCloseBtnClick);
    document.addEventListener('keydown', this.#onDocumentKeyDown);

    const filmPopupButtonsPresenter = new FilmPopupButtonsPresenter(changeData, filmsModel, this.#filmPopupComponent.element);

    render(this.#filmPopupComponent, siteFooterElement, RenderPosition.AFTEREND);
    filmPopupButtonsPresenter.init(film);
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
