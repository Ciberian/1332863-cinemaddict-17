import { createElement } from '../render.js';

const createShowMoreBtnTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ShowMoreBtnView {
  #element = null;

  get template() {
    return createShowMoreBtnTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element.remove();
    this.#element = null;
  }
}
