import FilmsSectionView from '../view/films-section-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreBtnView from '../view/show-more-btn-view.js';
import TopRatedFilmsView from '../view/top-rated-films-view.js';
import MostCommentedFilmsView from '../view/most-commented-films-view.js';
import FilmInfoView from '../view/film-info-view.js';
import { render } from '../render.js';

const RATED_FILMS_DISPLAYED = 2;
const COMMENTED_FILMS_DISPLAYED = 2;

export default class FilmsPresenter {
  filmsSectionComponent = new FilmsSectionView();
  filmsListComponent = new FilmsListView();
  filmsListContainerComponent = new FilmsContainerView();

  topRatedFilmsComponent = new TopRatedFilmsView();
  topRatedContainerComponent = new FilmsContainerView();

  mostCommentedFilmsComponent = new MostCommentedFilmsView();
  mostCommentedContainerComponent = new FilmsContainerView();

  init = (filmsContainer, filmsModel) => {
    this.filmsContainer = filmsContainer;
    this.filmsModel = filmsModel;
    this.films = [...this.filmsModel.getFilms()];
    this.comments = [...this.filmsModel.getComments()];

    render(this.filmsSectionComponent, this.filmsContainer);
    render(this.filmsListComponent, this.filmsSectionComponent.getElement());
    render(this.filmsListContainerComponent, this.filmsListComponent.getElement());

    for (let i = 0; i < this.films.length; i++) {
      render(new FilmCardView(this.films[i]), this.filmsListContainerComponent.getElement());
    }

    render(new ShowMoreBtnView(), this.filmsListComponent.getElement());

    render(this.topRatedFilmsComponent, this.filmsSectionComponent.getElement());
    render(this.topRatedContainerComponent, this.topRatedFilmsComponent.getElement());

    for (let i = 0; i < RATED_FILMS_DISPLAYED; i++) {
      render(new FilmCardView(this.films[i]), this.topRatedContainerComponent.getElement());
    }

    render(this.mostCommentedFilmsComponent, this.filmsSectionComponent.getElement());
    render(this.mostCommentedContainerComponent, this.mostCommentedFilmsComponent.getElement());

    for (let i = 0; i < COMMENTED_FILMS_DISPLAYED; i++) {
      render(new FilmCardView(this.films[i]), this.mostCommentedContainerComponent.getElement());
    }

    const filmPosters = document.querySelectorAll('.film-card__poster');
    const footer = document.querySelector('.footer');

    filmPosters.forEach((poster) => {
      poster.addEventListener('click', () => {
        render(new FilmInfoView(this.films[1], this.comments), footer, 'afterend');

        const closeBtn = document.querySelector('.film-details__close-btn');
        const filmDetails = document.querySelector('.film-details');

        closeBtn.addEventListener('click', () => {
          filmDetails.remove();
        });
      });
    });
  };
}
