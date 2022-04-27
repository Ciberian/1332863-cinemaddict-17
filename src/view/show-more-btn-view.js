import { createElement } from '../render.js';

const createShowMoreBtnTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ShowMoreBtnView {
  getTemplate() {
    return createShowMoreBtnTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
