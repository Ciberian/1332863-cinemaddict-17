import FilmPopupCommentsView from '../view/film-popup-comments-view.js';
import CommentsModel from '../model/comments-model.js';
import { render, remove, replace } from '../framework/render.js';

export default class CommentsPresenter {
  #commentsComponent = null;
  #commentsModel = new CommentsModel();

  init = (film, comments, container) => {

    const prevCommentsComponent = this.#commentsComponent;
    const selectedComments = comments.filter(({ id }) => film.comments.some((commentId) => commentId === Number(id)));

    this.#commentsComponent = new FilmPopupCommentsView(selectedComments);

    if (prevCommentsComponent === null) {
      render(this.#commentsComponent, container);
      return;
    }

    if (container.contains(prevCommentsComponent.element)) {
      replace(this.#commentsComponent, prevCommentsComponent);
    }

    remove(prevCommentsComponent);
  };

  #handleAddCommentModelEvent = (newComment) => {
    this.#commentsModel.addComment(newComment);
  };

  #handleDeleteCommentModelEvent = (comment) => {
    this.#commentsModel.deleteComment(comment);
  };

  destroy = () => {
    remove(this.#commentsComponent);
  };

}
