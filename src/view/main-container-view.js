import AbstractView from '../framework/view/abstract-view.js';

const createMainContainerTemplate = () => '<section class="films"></section>';

export default class MainContainerView extends AbstractView {
  get template() {
    return createMainContainerTemplate();
  }
}
