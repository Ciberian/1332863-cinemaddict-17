import FilmsSectionView from '../view/films-section-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreBtn from '../view/show-more-btn-view.js';
import TopRatedFilmsView from '../view/top-rated-films-view.js';
import MostCommentedFilmsView from '../view/most-commented-films-view.js';
import { render } from '../render.js';

const FILMS_AMOUNT_DISPLAYED = 5;

export default class FilmsPresenter {
  filmsSectionComponent = new FilmsSectionView();
  filmsListComponent = new FilmsListView();
  filmsContainerComponent = new FilmsContainerView();

  init = (filmsContainer) => {
    this.filmsContainer = filmsContainer;

    render(this.filmsSectionComponent, this.filmsContainer);
    render(this.filmsListComponent, this.filmsSectionComponent.getElement());
    render(this.filmsContainerComponent, this.filmsListComponent.getElement());

    for (let i = 0; i < FILMS_AMOUNT_DISPLAYED; i++) {
      render(new FilmCardView(), this.filmsContainerComponent.getElement());
    }

    render(new ShowMoreBtn(), this.filmsListComponent.getElement());
    render(new TopRatedFilmsView(), this.filmsSectionComponent.getElement());
    render(new MostCommentedFilmsView(), this.filmsSectionComponent.getElement());

  };
}
