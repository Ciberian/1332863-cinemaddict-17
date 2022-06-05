import FilmPopupCommentsView from '../view/film-popup-comments-view.js';
import CommentsModel from '../model/comments-model.js';
import { render } from '../framework/render.js';

export default class FilmPopupCommentsPresenter {
  #newComment = null;
  #oldComment = null;
  #commentsComponent = null;
  #commentsModel = new CommentsModel();

  constructor(newComment, oldComment) {
    this.#newComment = newComment;
    this.#oldComment = oldComment;
  }

  init = (film, comments, container) => {
    const selectedComments = comments.filter(({ id }) => film.comments.some((commentId) => Number(commentId) === Number(id)));
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
