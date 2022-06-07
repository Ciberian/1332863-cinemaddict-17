import FilmPopupCommentsView from '../view/film-popup-comments-view.js';
import FilmsApiService from '../films-api-service.js';
import CommentsModel from '../model/comments-model.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { render } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';

const AUTHORIZATION = 'Basic aV9dsF09wcl9lj8h';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict/';
const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class FilmPopupCommentsPresenter {
  #commentsModel = new CommentsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  init = (film, container) => {
    this.#commentsModel.init(film).
      then(() => this.#commentsModel.comments).
      then((comments) => new FilmPopupCommentsView(comments, film)).
      then((commentsComponent) => {
        render(commentsComponent, container);
        commentsComponent.setFormSubmitHandler(this.#handleFormSubmit);
        commentsComponent.setDeleteCommentHandler(this.#handleDeleteClick);
      });
  };

  #handleFormSubmit = (evt, comment, film) => {
    evt.preventDefault();
    console.log(evt, comment, film);

    this.#handleViewAction(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      comment,
      film
    );
  };

  #handleDeleteClick = (evt, comment) => {
    evt.preventDefault();

    this.#handleViewAction(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
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
          this.#unlockForm();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #shakeForm = () => {
  };

  #unlockForm = () => {
  };

  // #handleCommentsModelEvent = () => {
  //   this.init();
  // };
}
