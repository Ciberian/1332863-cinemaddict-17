import FilmPopupCommentsView from '../view/film-popup-comments-view.js';
import FilmsApiService from '../films-api-service.js';
import CommentsModel from '../model/comments-model.js';
import { render } from '../framework/render.js';

const AUTHORIZATION = 'Basic aV9dsF09wcl9lj8h';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict/';

export default class FilmPopupCommentsPresenter {
  #newComment = null;
  #oldComment = null;
  #commentsComponent = null;
  #commentsModel = new CommentsModel(new FilmsApiService(END_POINT, AUTHORIZATION));

  constructor(newComment, oldComment) {
    this.#newComment = newComment;
    this.#oldComment = oldComment;
  }

  init = async (film, container) => {
    await this.#commentsModel.init(film);
    const selectedComments = this.#commentsModel.comments;
    this.#commentsComponent = new FilmPopupCommentsView(selectedComments);
    render(this.#commentsComponent, container);

    this.#commentsComponent.setDeleteClickHandler(this.#handleDeleteCommentViewAction);
    this.#commentsComponent.setDocumentKeydownHandler(this.#handleAddCommentViewAction);
  };

  #handleDeleteCommentViewAction = () => {
    this.#commentsModel.deleteComment(this.#oldComment);
  };

  #handleAddCommentViewAction = () => {
    document.body.addEventListener('keydown', (evt) => {
      if (evt.ctrlKey && evt.code === 'Enter') {
        this.#commentsModel.addComment(this.#newComment);
      }
    });
  };

  #handleCommentsModelEvent = () => {
    this.init();
  };
}
