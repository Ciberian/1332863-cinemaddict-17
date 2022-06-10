import FilmPopupCommentsView from '../view/film-popup-comments-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { render, remove } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class FilmPopupCommentsPresenter {
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);
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

  #handleFormSubmit = (evt, comment, film) => {
    evt.preventDefault();

    this.#handleViewAction(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      comment,
      film
    );
  };

  #handleDeleteClick = (evt, comment) => {
    evt.preventDefault();

    this.#handleViewAction(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      comment,
    );
  };

  #handleViewAction = async (actionType, updateType, update, film) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.ADD_COMMENT:
        try {
          await this.#commentsModel.addComment(updateType, update, film);
        } catch(err) {
          this.#shakeForm();
        }
        break;
      case UserAction.DELETE_COMMENT:
        try {
          await this.#commentsModel.deleteComment(updateType, update);
        } catch(err) {
          this.#shakeForm();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #shakeForm = () => {
  };

  #handleCommentsModelEvent = (updateType, update) => {
    const newComments = update.comments;
    remove(this.#commentsComponent);
    this.init(newComments);
  };
}
