import { createElement } from '../render.js';

const createTopRatedFilmsTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>
  </section>`
);

export default class TopRatedFilmsView {
  #element = null;

  get template() {
    return createTopRatedFilmsTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
