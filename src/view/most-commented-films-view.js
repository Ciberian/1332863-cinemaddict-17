import AbstractView from '../framework/view/abstract-view.js';

const createMostCommentedFilmsTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>
  </section>`
);

export default class MostCommentedFilmsView extends AbstractView {
  get template() {
    return createMostCommentedFilmsTemplate();
  }
}
