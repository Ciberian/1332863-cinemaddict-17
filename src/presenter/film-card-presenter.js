import FilmInfoView from '../view/film-info-view.js';
import { render } from '../render.js';

const body = document.querySelector('body');
const footer = document.querySelector('.footer');

export default class FilmCardPresenter {
  #filmCards = null;
  #filmsModel = null;
  #films = [];
  #comments = [];

  showPopup = (filmCards, filmsModel) => {
    this.#filmCards = filmCards;
    this.#filmsModel = filmsModel;
    this.#films = [...this.#filmsModel.films];
    this.#comments = [...this.#filmsModel.comments];

    this.#filmCards.forEach((filmCard) => {
      filmCard.addEventListener('click', () => {
        const filmData = this.#films.find(({id}) => id === Number(filmCard.dataset.id));
        const selectedComments = this.#comments.filter(({id}) => filmData.comments.some((commentId) => commentId === Number(id)));

        render(new FilmInfoView(filmData, selectedComments), footer, 'afterend');
        body.classList.add('hide-overflow');

        const filmDetails = document.querySelector('.film-details');
        const closeBtn = filmDetails.querySelector('.film-details__close-btn');

        const closePopupByEscape = (evt) => {
          if (evt.code === 'Escape') {
            body.classList.remove('hide-overflow');
            filmDetails.remove();
          }
        };

        const closePopupByClick = () => {
          document.removeEventListener('keydown', closePopupByEscape, {once: true});
          body.classList.remove('hide-overflow');
          filmDetails.remove();
        };

        document.addEventListener('keydown', closePopupByEscape, {once: true});
        closeBtn.addEventListener('click', closePopupByClick);
      });
    });
  };
}
