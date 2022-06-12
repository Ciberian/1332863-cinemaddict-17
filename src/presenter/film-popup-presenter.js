import FilmPopupView from '../view/film-popup-view.js';
import FilmPopupButtonsPresenter from './film-popup-buttons-presenter.js';
import FilmPopupCommentsPresenter from './film-popup-comments-presenter.js';
import { render, remove, RenderPosition } from '../framework/render.js';

let prevPopupComponent = null;
let prevCommentPresenter = null;

export default class FilmPopupPresenter {
  #filmPopupCommentsPresenter = null;
  #filmPopupComponent = null;
  #commentsModel = null;
  #comments = null;

  constructor(commentsModel) {
    this.#commentsModel = commentsModel;
  }

  async init(film, filmsModel) {
    if (prevPopupComponent?.film.id === film.id) {
      return;
    } else if (prevPopupComponent) {
      prevPopupComponent.removeAllHandlers();
      prevCommentPresenter.removeAllHandlers();
      remove(prevPopupComponent);
    }

    this.#filmPopupComponent = new FilmPopupView(film);
    prevPopupComponent = this.#filmPopupComponent;
    render(this.#filmPopupComponent, document.querySelector('.footer'), RenderPosition.AFTEREND);
    this.#filmPopupComponent.setClickHandler(this.#removeFilmPopup);
    this.#filmPopupComponent.setKeydownHandler(this.#removeFilmPopup);
    document.body.classList.add('hide-overflow');

    const filmPopupButtonsPresenter = new FilmPopupButtonsPresenter(filmsModel, this.#filmPopupComponent.element);
    filmPopupButtonsPresenter.init(film);

    await this.#commentsModel.init(film);
    this.#comments = this.#commentsModel.comments;
    this.#filmPopupCommentsPresenter = new FilmPopupCommentsPresenter(film, this.#filmPopupComponent.element, filmsModel, this.#commentsModel);
    prevCommentPresenter = this.#filmPopupCommentsPresenter;
    this.#filmPopupCommentsPresenter.init(this.#comments);
  }

  #removeFilmPopup = () => {
    remove(this.#filmPopupComponent);
    document.body.classList.remove('hide-overflow');
    this.#filmPopupCommentsPresenter.removeAllHandlers();
    prevPopupComponent = null;
  };
}
