import FilmsSectionView from '../view/films-section-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreBtnView from '../view/show-more-btn-view.js';
import TopRatedFilmsView from '../view/top-rated-films-view.js';
import MostCommentedFilmsView from '../view/most-commented-films-view.js';
import { render } from '../render.js';

const RATED_FILMS_DISPLAYED = 2;
const COMMENTED_FILMS_DISPLAYED = 2;

export default class FilmsPresenter {
  filmsSectionComponent = new FilmsSectionView();
  filmsListComponent = new FilmsListView();
  filmsContainerMainListComponent = new FilmsContainerView();

  topRatedFilmsComponent = new TopRatedFilmsView();
  filmsContainerTopListComponent = new FilmsContainerView();

  mostCommentedFilmsComponent = new MostCommentedFilmsView();
  filmsContainerCommentedListComponent = new FilmsContainerView();

  init = (filmsContainer, filmsModel) => {
    this.filmsContainer = filmsContainer;
    this.filmsModel = filmsModel;
    this.films = [...this.filmsModel.getFilms()];

    render(this.filmsSectionComponent, this.filmsContainer);
    render(this.filmsListComponent, this.filmsSectionComponent.getElement());
    render(this.filmsContainerMainListComponent, this.filmsListComponent.getElement());

    for (let i = 0; i < this.films.length; i++) {
      render(new FilmCardView(this.films[i]), this.filmsContainerMainListComponent.getElement());
    }

    render(new ShowMoreBtnView(), this.filmsListComponent.getElement());

    render(this.topRatedFilmsComponent, this.filmsSectionComponent.getElement());
    render(this.filmsContainerTopListComponent, this.topRatedFilmsComponent.getElement());

    for (let i = 0; i < RATED_FILMS_DISPLAYED; i++) {
      render(new FilmCardView(this.films[i]), this.filmsContainerTopListComponent.getElement());
    }

    render(this.mostCommentedFilmsComponent, this.filmsSectionComponent.getElement());
    render(this.filmsContainerCommentedListComponent, this.mostCommentedFilmsComponent.getElement());

    for (let i = 0; i < COMMENTED_FILMS_DISPLAYED; i++) {
      render(new FilmCardView(this.films[i]), this.filmsContainerCommentedListComponent.getElement());
    }
  };
}
