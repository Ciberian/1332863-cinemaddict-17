import FilmPopupCommentsView from '../view/film-popup-comments-view.js';
import { render, remove } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';

export default class FilmPopupCommentsPresenter {
  #film = null;
  #container = null;
  #commentsModel = null;
  #commentsComponent = null;
  #uiBlocker = null;

  constructor(film, container, commentsModel, uiBlocker) {
    this.#film = film;
    this.#container = container;
    this.#commentsModel = commentsModel;
    this.#uiBlocker = uiBlocker;

    this.#commentsModel.addObserver(this.#handleCommentsModelEvent);
  }

  init = (comments) => {
    this.#commentsComponent = new FilmPopupCommentsView(comments, this.#film);
    render(this.#commentsComponent, this.#container.querySelector('.film-details__inner'));

    this.#commentsComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#commentsComponent.setDeleteCommentHandler(this.#handleDeleteClick);
  };

  #handleFormSubmit = (evt, update) => {
    evt.preventDefault();

    this.#handleViewAction(
      UserAction.ADD_COMMENT,
      UpdateType.MAJOR,
      update
    );
  };

  #handleDeleteClick = (evt, update) => {
    evt.preventDefault();

    this.#handleViewAction(
      UserAction.DELETE_COMMENT,
      UpdateType.MAJOR,
      update
    );
  };

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#uiBlocker.block();
        try {
          await this.#commentsModel.addComment(updateType, update);
        } catch(err) {
          this.#commentsComponent.shake();
          update.textarea.disabled = false;
          this.#uiBlocker.unblock();
        }
        this.#uiBlocker.unblock();
        break;
      case UserAction.DELETE_COMMENT:
        try {
          await this.#commentsModel.deleteComment(updateType, update);
        } catch(err) {
          this.#commentsComponent.shake(() => {
            update.deleteButton.disabled = false;
            update.deleteButton.textContent = 'Delete';
          });
        }
        break;
    }
  };

  #handleCommentsModelEvent = (updateType, update) => {
    const newComments = update.comments;
    remove(this.#commentsComponent);
    this.init(newComments);
  };
}
