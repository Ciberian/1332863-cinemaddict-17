import AbstractView from '../framework/view/abstract-view.js';

const createShowMoreBtnTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ShowMoreBtnView extends AbstractView {
  get template() {
    return createShowMoreBtnTemplate();
  }

  setShowMoreBtnClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#showMoreBtnClickHandler);
  };

  #showMoreBtnClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
