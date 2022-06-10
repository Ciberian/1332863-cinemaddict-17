import FilmPopupView from '../view/film-popup-view.js';
import FilmPopupButtonsPresenter from './film-popup-buttons-presenter.js';
import FilmPopupCommentsPresenter from './film-popup-comments-presenter.js';
import FilmsApiService from '../films-api-service.js';
import CommentsModel from '../model/comments-model.js';
import { render, remove, RenderPosition } from '../framework/render.js';

const AUTHORIZATION = 'Basic aV9dsF09wcl9lj8h';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict/';
let prevPopupComponent = null;
let prevCommentPresenter = null;

export default class FilmPopupPresenter {
  #commentsModel = new CommentsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
  #filmPopupCommentsPresenter = null;
  #filmPopupComponent = null;
  #comments = null;

  async init(film, changeData, filmsModel) {
    if (prevPopupComponent) {
      prevPopupComponent.removeAllHandlers();
      prevCommentPresenter.removeAllHandlers();
      remove(prevPopupComponent);
    }

    this.#filmPopupComponent = new FilmPopupView(film);
    prevPopupComponent = this.#filmPopupComponent;
    this.#filmPopupComponent.setClickHandler(this.#removeFilmPopup);
    this.#filmPopupComponent.setKeydownHandler(this.#removeFilmPopup);
    document.body.classList.add('hide-overflow');

    const filmPopupButtonsPresenter = new FilmPopupButtonsPresenter(changeData, filmsModel, this.#filmPopupComponent.element);
    render(this.#filmPopupComponent, document.querySelector('.footer'), RenderPosition.AFTEREND);
    filmPopupButtonsPresenter.init(film);

    await this.#commentsModel.init(film);
    this.#comments = this.#commentsModel.comments;
    this.#filmPopupCommentsPresenter = new FilmPopupCommentsPresenter(film, this.#filmPopupComponent.element, this.#commentsModel);
    prevCommentPresenter = this.#filmPopupCommentsPresenter;
    this.#filmPopupCommentsPresenter.init(this.#comments);
  }

  #removeFilmPopup = () => {
    remove(this.#filmPopupComponent);
    document.body.classList.remove('hide-overflow');
    this.#filmPopupCommentsPresenter.removeAllHandlers();
  };
}
