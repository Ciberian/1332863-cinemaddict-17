import UserNameView from '../view/user-name-view.js';
import FilmCountView from '../view/film-count-view.js';
import FilmsSectionView from '../view/films-section-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmPresenter from './film-presenter.js';
import TopRatedFilmsPresenter from './top-rated-films-presenter.js';
import MostCommentedFilmsPresenter from './most-commented-films-presenter.js';
import SortView from '../view/sort-view.js';
import LoadingView from '../view/film-loading-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import ShowMoreBtnView from '../view/show-more-btn-view.js';
import { filter } from '../utils/filter.js';
import { sortFilmsDateDown } from '../utils/films.js';
import { SortType, UpdateType, FilterType } from '../const.js';
import { render, remove, RenderPosition } from '../framework/render.js';

const FILM_COUNT_PER_STEP = 5;

export default class FilmBoardPresenter {
  #filmsSectionComponent = new FilmsSectionView();
  #filmsListComponent = new FilmsListView();
  #filmsListContainerComponent = new FilmsContainerView();
  #loadingComponent = new LoadingView();

  #userNameComponent = null;
  #sortComponent = null;
  #noFilmsComponent = null;
  #showMoreBtnComponent = null;
  #topRatedFilmsPresenter = null;
  #mostCommentedFilmsPresenter = null;

  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmsContainer = null;
  #filterModel = null;
  #filmsModel = null;
  #commentsModel = null;
  #filmPresenters = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #watchedFilms = null;
  #isLoading = true;

  constructor(filmsContainer, filterModel, filmsModel, commentsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#updateLocalData);
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  #updateLocalData = (updateType, update) => {
    const updatedFilm = this.#filmsModel.films.find((film) => film.id === update.movie.id);
    updatedFilm.comments = update.movie.comments;
  };

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);
    this.#watchedFilms = filter[FilterType.HISTORY](films);

    switch (this.#currentSortType) {
      case SortType.RATE_DOWN:
        return filteredFilms.slice().sort((filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating);
      case SortType.DATE_DOWN:
        return filteredFilms.slice().sort(sortFilmsDateDown);
      default:
        return filteredFilms;
    }
  }

  init = () => {
    this.#renderMainFilmList();
    this.#renderExtraFilmLists();
  };

  #renderSort = () => {
    if (this.films.length) {
      this.#sortComponent = new SortView(this.#currentSortType);
      this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

      render(this.#sortComponent, this.#filmsSectionComponent.element, RenderPosition.BEFOREBEGIN);
    }
  };

  #renderNoFilms = () => {
    this.#noFilmsComponent = new ListEmptyView(this.#filterType);
    render(this.#noFilmsComponent, this.#filmsSectionComponent.element, 'AFTERBEGIN');
  };

  #renderShowMoreBtn = () => {
    this.#showMoreBtnComponent = new ShowMoreBtnView();
    this.#showMoreBtnComponent.setClickHandler(this.#handleShowMoreBtnClick);

    render(this.#showMoreBtnComponent, this.#filmsListComponent.element);
  };

  #renderFilm = (film, container) => {
    const filmPresenter = new FilmPresenter(container, this.#filmsModel, this.#commentsModel);
    filmPresenter.init(film);
    this.#filmPresenters.set(film.id, filmPresenter);
  };

  #renderFilms = (films, container) => {
    films.forEach((film) => this.#renderFilm(film, container));
  };

  #renderMainFilmList = () => {
    const films = this.films;
    const filmCount = films.length;

    render(this.#filmsSectionComponent, this.#filmsContainer);

    if (this.#isLoading) {
      render(this.#loadingComponent, this.#filmsSectionComponent.element, RenderPosition.AFTERBEGIN);
      return;
    }

    if (!filmCount) {
      this.#renderNoFilms();
      return;
    }

    this.#userNameComponent = new UserNameView(this.#watchedFilms.length);
    if (this.#watchedFilms.length) {
      render(this.#userNameComponent, document.querySelector('.header'));
    }

    this.#renderSort();
    render(this.#filmsListComponent, this.#filmsSectionComponent.element, RenderPosition.AFTERBEGIN);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    this.#renderFilms(films.slice(0, Math.min(filmCount, this.#renderedFilmCount)), this.#filmsListContainerComponent.element);

    if (filmCount > this.#renderedFilmCount) {
      this.#renderShowMoreBtn();
    }
  };

  #renderExtraFilmLists = () => {
    if (this.films.length) {
      this.#topRatedFilmsPresenter = new TopRatedFilmsPresenter(this.#filmsModel, this.#commentsModel, this.#filmsSectionComponent.element);
      this.#mostCommentedFilmsPresenter = new MostCommentedFilmsPresenter(this.#filmsModel, this.#commentsModel, this.#filmsSectionComponent.element);

      this.#topRatedFilmsPresenter.init();
      this.#mostCommentedFilmsPresenter.init();
    }
  };

  #clearFilmBoard = ({
    resetRenderedFilmCount = false,
    resetSortType = false,
    isCommentModelInit = false } = {}) => {
    const filmCount = this.films.length;
    remove(this.#sortComponent);
    remove(this.#showMoreBtnComponent);

    this.#filmPresenters.forEach((presenter) => presenter.destroy());
    this.#filmPresenters.clear();

    if (this.#userNameComponent) {
      remove(this.#userNameComponent);
    }

    if (this.#noFilmsComponent) {
      remove(this.#noFilmsComponent);
    }

    this.#renderedFilmCount = (resetRenderedFilmCount && !isCommentModelInit) ?
      FILM_COUNT_PER_STEP :
      Math.min(filmCount, this.#renderedFilmCount);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #handleModelEvent = (updateType, updatedFilm) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#filmPresenters.get(updatedFilm.id)) {
          this.#filmPresenters.get(updatedFilm.id).init(updatedFilm);
        }
        break;
      case UpdateType.MINOR:
        this.#clearFilmBoard();
        this.#renderMainFilmList();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmBoard({
          resetRenderedFilmCount: true,
          resetSortType: true,
          isCommentModelInit: updatedFilm?.isCommentModelInit,
        });
        this.#renderMainFilmList();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.init();
        render(new FilmCountView(this.films.length), document.querySelector('.footer__statistics'));
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmBoard({ resetRenderedFilmCount: true });
    this.#renderMainFilmList();
  };

  #handleShowMoreBtnClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilms(films, this.#filmsListContainerComponent.element);
    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#showMoreBtnComponent);
    }
  };
}
