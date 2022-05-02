import FilmInfoView from '../view/film-info-view.js';
import { render } from '../render.js';

const footer = document.querySelector('.footer');

export default class FilmCardPresenter {
  constructor(filmCards, filmsModel) {
    this.filmCards = filmCards;
    this.filmsModel = filmsModel;
    this.films = [...this.filmsModel.getFilms()];
    this.comments = [...this.filmsModel.getComments()];
  }

  showPopup = () => {
    this.filmCards.forEach((filmCard) => {
      filmCard.addEventListener('click', () => {
        const filmData = this.films.find(({id}) => id === Number(filmCard.dataset.id));
        const selectedComments = this.comments.filter(({id}) => filmData.comments.some((commentId) => commentId === Number(id)));

        render(new FilmInfoView(filmData, selectedComments), footer, 'afterend');

        const filmDetails = document.querySelector('.film-details');
        const closeBtn = filmDetails.querySelector('.film-details__close-btn');

        const closePopupWindow = (evt) => {
          if (evt.code === 'Escape') {
            filmDetails.remove();
          }
        };

        document.addEventListener('keydown', closePopupWindow, {once: true});

        closeBtn.addEventListener('click', () => {
          document.removeEventListener('keydown', closePopupWindow, {once: true});
          filmDetails.remove();
        });
      });
    });
  };
}
