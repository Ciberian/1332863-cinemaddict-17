import FilmsSectionView from '../view/films-section-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import ShowMoreBtnView from '../view/show-more-btn-view.js';
import TopRatedFilmsView from '../view/top-rated-films-view.js';
import MostCommentedFilmsView from '../view/most-commented-films-view.js';
import { render } from '../render.js';

const RATED_FILMS_DISPLAYED = 2;
const COMMENTED_FILMS_DISPLAYED = 2;

const addFilmPopup = (film, commentsList) => {
  if(!document.querySelector('.film-details')) {
    const siteFooterElement = document.querySelector('.footer');
    const selectedComments = commentsList.filter(({id}) => film.comments.some((commentId) => commentId === Number(id)));
    const filmPopupComponent = new FilmPopupView(film, selectedComments);

    render(filmPopupComponent, siteFooterElement, 'afterend');
    document.body.classList.add('hide-overflow');

    document.addEventListener('keydown', onDocumentKeyDown);
    filmPopupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', onCloseBtnClick);
  }
};

const removeFilmPopup = () => {
  document.body.classList.remove('hide-overflow');
  document.querySelector('.film-details').remove();
  document.removeEventListener('keydown', onDocumentKeyDown);
};

function onCloseBtnClick() {
  removeFilmPopup();
}

function onDocumentKeyDown(evt) {
  if (evt.code === 'Escape') {
    evt.preventDefault();
    removeFilmPopup();
  }
}

export default class FilmsListPresenter {
  #filmsSectionComponent = new FilmsSectionView();
  #filmsListComponent = new FilmsListView();
  #filmsListContainerComponent = new FilmsContainerView();

  #topRatedFilmsComponent = new TopRatedFilmsView();
  #topRatedContainerComponent = new FilmsContainerView();

  #mostCommentedFilmsComponent = new MostCommentedFilmsView();
  #mostCommentedContainerComponent = new FilmsContainerView();

  #filmsContainer = null;
  #filmsModel = null;
  #films = [];
  #comments = [];

  init = (filmsContainer, filmsModel) => {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
    this.#films = [...this.#filmsModel.films];
    this.#comments = [...this.#filmsModel.comments];

    render(this.#filmsSectionComponent, this.#filmsContainer);
    render(this.#filmsListComponent, this.#filmsSectionComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    for (let i = 0; i < this.#films.length; i++) {
      this.#renderFilm(this.#films[i], this.#filmsListContainerComponent.element);
    }

    render(new ShowMoreBtnView(), this.#filmsListComponent.element);

    render(this.#topRatedFilmsComponent, this.#filmsSectionComponent.element);
    render(this.#topRatedContainerComponent, this.#topRatedFilmsComponent.element);

    for (let i = 0; i < RATED_FILMS_DISPLAYED; i++) {
      this.#renderFilm(this.#films[i], this.#topRatedContainerComponent.element);
    }

    render(this.#mostCommentedFilmsComponent, this.#filmsSectionComponent.element);
    render(this.#mostCommentedContainerComponent, this.#mostCommentedFilmsComponent.element);

    for (let i = 0; i < COMMENTED_FILMS_DISPLAYED; i++) {
      this.#renderFilm(this.#films[i], this.#mostCommentedContainerComponent.element);
    }
  };

  #renderFilm = (film, container) => {
    const filmCardComponent = new FilmCardView(film);

    filmCardComponent.element.querySelector('.film-card__link').addEventListener('click', () => addFilmPopup(film, this.#comments));

    render(filmCardComponent, container);
  };
}
