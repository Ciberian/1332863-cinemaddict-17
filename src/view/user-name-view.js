import AbstractView from '../framework/view/abstract-view.js';

const getUserType = (watchedFilmCount) => {
  if (watchedFilmCount <= 10) {
    return 'Novice';
  }

  if (watchedFilmCount <= 20) {
    return 'Fan';
  }

  return 'Movie Buff';
};

const createUserNameTemplate = (watchedFilmCount) => `
    <section class="header__profile profile">
      <p class="profile__rating">${getUserType(watchedFilmCount)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`;

export default class UserNameView extends AbstractView {
  #watchedFilmCount = null;

  constructor(watchedFilmCount) {
    super();
    this.#watchedFilmCount = watchedFilmCount;
  }

  get template() {
    return createUserNameTemplate(this.#watchedFilmCount);
  }
}
