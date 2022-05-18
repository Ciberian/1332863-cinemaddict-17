import FilmsSectionView from '../view/films-section-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmPresenter from './film-presenter.js';
import SortView from '../view/sort-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import ShowMoreBtnView from '../view/show-more-btn-view.js';
import TopRatedFilmsView from '../view/top-rated-films-view.js';
import MostCommentedFilmsView from '../view/most-commented-films-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { updateItem, sortFilmsDateDown } from '../utils.js';
import { SortType } from '../const.js';

const RATED_FILMS_DISPLAYED = 2;
const COMMENTED_FILMS_DISPLAYED = 2;
const FILM_COUNT_PER_STEP = 5;

export default class FilmsListPresenter {
  #filmsSectionComponent = new FilmsSectionView();
  #filmsListComponent = new FilmsListView();
  #filmsListContainerComponent = new FilmsContainerView();

  #topRatedFilmsComponent = new TopRatedFilmsView();
  #topRatedContainerComponent = new FilmsContainerView();

  #mostCommentedFilmsComponent = new MostCommentedFilmsView();
  #mostCommentedContainerComponent = new FilmsContainerView();

  #showMoreBtnComponent = new ShowMoreBtnView();
  #sortComponent = new SortView();

  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmsContainer = null;
  #filmsModel = null;
  #films = [];
  #comments = [];
  #filmsPresenter = new Map();
  #sourcedFilmList = [];
  #currentSortType = SortType.DEFAULT;

  constructor(filmsContainer, filmsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
    this.#comments = [...this.#filmsModel.comments];
  }

  init = () => {
    this.#films = [...this.#filmsModel.films];
    this.#sourcedFilmList = [...this.#filmsModel.films];

    this.#renderFilmList();

    if (this.#films.length) {
      this.#renderTopRatedList();
      this.#renderMostCommentedList();
    }
  };

  #renderSort = () => {
    if(this.#films.length) {
      render(this.#sortComponent, this.#filmsSectionComponent.element, RenderPosition.BEFOREBEGIN);
      this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    }
  };

  #renderFilm = (film, container, category) => {
    const filmPresenter = new FilmPresenter(this.#comments, this.#handleFilmChange, this.#handleСlosePopup, container);

    filmPresenter.init(film);

    switch (category) {
      case 'topRated':
        this.#filmsPresenter.set(`${film.id}-topRated`, filmPresenter);
        break;
      case 'mostComm':
        this.#filmsPresenter.set(`${film.id}-mostComm`, filmPresenter);
        break;
      default:
        this.#filmsPresenter.set(film.id, filmPresenter);
    }
  };

  #renderFilmList = () => {
    render(this.#filmsSectionComponent, this.#filmsContainer);

    if (!this.#films.length) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();

    render(this.#filmsListComponent, this.#filmsSectionComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    for (let i = 0; i < Math.min(this.#films.length, FILM_COUNT_PER_STEP); i++) {
      this.#renderFilm(this.#films[i], this.#filmsListContainerComponent.element);
    }

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreBtn();
    }
  };

  #renderNoFilms = () => {
    render(new ListEmptyView(), this.#filmsSectionComponent.element);
  };

  #renderShowMoreBtn = () => {
    render(this.#showMoreBtnComponent, this.#filmsListComponent.element);
    this.#showMoreBtnComponent.setClickHandler(this.#handleShowMoreBtnClick);
  };

  #renderTopRatedList = () => {
    render(this.#topRatedFilmsComponent, this.#filmsSectionComponent.element);
    render(this.#topRatedContainerComponent, this.#topRatedFilmsComponent.element);

    this.#films
      .slice()
      .sort((filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating)
      .slice(0, RATED_FILMS_DISPLAYED)
      .forEach((topRatedFilm) => this.#renderFilm(topRatedFilm, this.#topRatedContainerComponent.element, 'topRated'));
  };

  #renderMostCommentedList = () => {
    render(this.#mostCommentedFilmsComponent, this.#filmsSectionComponent.element);
    render(this.#mostCommentedContainerComponent, this.#mostCommentedFilmsComponent.element);

    this.#films
      .slice()
      .sort((filmA, filmB) => filmB.comments.length - filmA.comments.length)
      .slice(0, COMMENTED_FILMS_DISPLAYED)
      .forEach((mostCommentedFilm) => this.#renderFilm(mostCommentedFilm, this.#mostCommentedContainerComponent.element, 'mostComm'));
  };

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.RATE_DOWN:
        this.#films.sort((filmA, filmB) =>filmB.filmInfo.totalRating - filmA.filmInfo.totalRating);
        break;
      case SortType.DATE_DOWN:
        this.#films.sort(sortFilmsDateDown);
        break;
      default:
        this.#films = [...this.#sourcedFilmList];
    }

    this.#currentSortType = sortType;
  };

  #clearFilmList = () => {
    this.#filmsPresenter.forEach((presenter) => presenter.destroy());
    this.#filmsPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#showMoreBtnComponent);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    this.#clearFilmList();

    this.#renderFilmList();
    this.#renderTopRatedList();
    this.#renderMostCommentedList();
  };

  #handleFilmChange = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#sourcedFilmList = updateItem(this.#sourcedFilmList, updatedFilm);

    if (this.#filmsPresenter.get(updatedFilm.id)) {
      this.#filmsPresenter.get(updatedFilm.id).init(updatedFilm);
    }

    const topRatedFilm = this.#filmsPresenter.get(`${updatedFilm.id}-topRated`);
    if (topRatedFilm) {
      topRatedFilm.init(updatedFilm);
    }

    const mostCommentedFilm = this.#filmsPresenter.get(`${updatedFilm.id}-mostComm`);
    if (mostCommentedFilm) {
      mostCommentedFilm.init(updatedFilm);
    }
  };

  #handleShowMoreBtnClick = () => {
    this.#films
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilm(film, this.#filmsListContainerComponent.element));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#films.length) {
      remove(this.#showMoreBtnComponent);
    }
  };

  #handleСlosePopup = () => {
    this.#filmsPresenter.forEach((presenter) => {
      presenter.removeFilmPopup();
    });
  };
}
