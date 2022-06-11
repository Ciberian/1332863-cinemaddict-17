import FilmPopupCommentsView from '../view/film-popup-comments-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { render, remove } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

export default class FilmPopupCommentsPresenter {
  #film = null;
  #container = null;
  #commentsModel = null;
  #commentsComponent = null;

  constructor(film, container, commentsModel) {
    this.#film = film;
    this.#container = container;
    this.#commentsModel = commentsModel;

    this.#commentsModel.addObserver(this.#handleCommentsModelEvent);
  }

  init = (comments) => {
    this.#commentsComponent = new FilmPopupCommentsView(comments, this.#film);
    render(this.#commentsComponent, this.#container);

    this.#commentsComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#commentsComponent.setDeleteCommentHandler(this.#handleDeleteClick);
  };

  removeAllHandlers = () => {
    this.#commentsComponent.removeAllHandlers();
  };

  #handleFormSubmit = (evt, update) => {
    evt.preventDefault();

    this.#handleViewAction(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      update
    );
  };

  #handleDeleteClick = (evt, update) => {
    evt.preventDefault();

    this.#handleViewAction(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      update
    );
  };

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        uiBlocker.block();
        try {
          await this.#commentsModel.addComment(updateType, update);
          this.removeAllHandlers();
        } catch(err) {
          this.#commentsComponent.shake();
          update.textarea.disabled = false;
          uiBlocker.unblock();
        }
        uiBlocker.unblock();
        break;
      case UserAction.DELETE_COMMENT:
        try {
          await this.#commentsModel.deleteComment(updateType, update);
          this.removeAllHandlers();
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
