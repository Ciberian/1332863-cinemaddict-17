import MainContainerView from '../view/main-container-view.js';
import AllFilmsView from '../view/all-films-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmPresenter from './film-presenter.js';
import SortView from '../view/sort-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import ShowMoreBtnView from '../view/show-more-btn-view.js';
import TopRatedFilmsView from '../view/top-rated-films-view.js';
import MostCommentedFilmsView from '../view/most-commented-films-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { sortFilmsDateDown } from '../utils/films.js';
import { SortType, UpdateType } from '../const.js';

const RATED_FILMS_DISPLAYED = 2;
const COMMENTED_FILMS_DISPLAYED = 2;
const FILM_COUNT_PER_STEP = 5;

export default class FilmBoardPresenter {
  #mainContainerComponent = new MainContainerView();
  #allFilmsComponent = new AllFilmsView();
  #allFilmsContainerComponent = new FilmsContainerView();

  #topRatedFilmsComponent = new TopRatedFilmsView();
  #topRatedContainerComponent = new FilmsContainerView();

  #mostCommentedFilmsComponent = new MostCommentedFilmsView();
  #mostCommentedContainerComponent = new FilmsContainerView();

  #sortComponent = null;
  #showMoreBtnComponent = null;

  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmsContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #comments = [];
  #filmPresenters = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor(filmsContainer, filmsModel, commentsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#comments = [...this.#commentsModel.comments];

    this.#filmsModel.addObserver(this.#handleFilmsModelEvent);
  }

  get films() {
    switch (this.#currentSortType) {
      case SortType.RATE_DOWN:
        return [...this.#filmsModel.films].sort((filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating);
      case SortType.DATE_DOWN:
        return [...this.#filmsModel.films].sort(sortFilmsDateDown);
      default:
        return this.#filmsModel.films;
    }
  }

  init = () => {
    this.#renderFilmBoard();

    if (this.films.length) {
      this.#renderTopRatedList();
      this.#renderMostCommentedList();
    }
  };

  #renderSort = () => {
    if (this.films.length) {
      this.#sortComponent = new SortView(this.#currentSortType);
      this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

      render(this.#sortComponent, this.#mainContainerComponent.element, RenderPosition.BEFOREBEGIN);
    }
  };

  #renderFilm = (film, container, category) => {
    const filmPresenter = new FilmPresenter(this.#comments, this.#handleViewAction, this.#handleСlosePopup, container);

    filmPresenter.init(film);

    switch (category) {
      case 'topRated':
        this.#filmPresenters.set(`${film.id}-topRated`, filmPresenter);
        break;
      case 'mostComm':
        this.#filmPresenters.set(`${film.id}-mostComm`, filmPresenter);
        break;
      default:
        this.#filmPresenters.set(film.id, filmPresenter);
    }
  };

  #renderFilms = (films, container, category = null) => {
    films.forEach((film) => this.#renderFilm(film, container, category));
  };

  #renderFilmBoard = () => {
    const films = this.films;
    const filmCount = films.length;

    render(this.#mainContainerComponent, this.#filmsContainer);

    if (!filmCount) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    render(this.#allFilmsComponent, this.#mainContainerComponent.element);
    render(this.#allFilmsContainerComponent, this.#allFilmsComponent.element);

    this.#renderFilms(films.slice(0, Math.min(filmCount, this.#renderedFilmCount)), this.#allFilmsContainerComponent.element);

    if (filmCount > this.#renderedFilmCount) {
      this.#renderShowMoreBtn();
    }
  };

  #renderNoFilms = () => {
    render(new ListEmptyView(), this.#mainContainerComponent.element);
  };

  #renderShowMoreBtn = () => {
    this.#showMoreBtnComponent = new ShowMoreBtnView();
    this.#showMoreBtnComponent.setClickHandler(this.#handleShowMoreBtnClick);

    render(this.#showMoreBtnComponent, this.#allFilmsComponent.element);
  };

  #renderTopRatedList = () => {
    render(this.#topRatedFilmsComponent, this.#mainContainerComponent.element);
    render(this.#topRatedContainerComponent, this.#topRatedFilmsComponent.element);

    this.films
      .slice()
      .sort((filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating)
      .slice(0, RATED_FILMS_DISPLAYED)
      .forEach((topRatedFilm) => this.#renderFilm(topRatedFilm, this.#topRatedContainerComponent.element, 'topRated'));
  };

  #renderMostCommentedList = () => {
    render(this.#mostCommentedFilmsComponent, this.#mainContainerComponent.element);
    render(this.#mostCommentedContainerComponent, this.#mostCommentedFilmsComponent.element);

    this.films
      .slice()
      .sort((filmA, filmB) => filmB.comments.length - filmA.comments.length)
      .slice(0, COMMENTED_FILMS_DISPLAYED)
      .forEach((mostCommentedFilm) => this.#renderFilm(mostCommentedFilm, this.#mostCommentedContainerComponent.element, 'mostComm'));
  };

  #clearFilmBoard = ({ resetRenderedFilmCount = false, resetSortType = false } = {}) => {
    const filmCount = this.films.length;

    this.#filmPresenters.forEach((presenter) => presenter.destroy());
    this.#filmPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#showMoreBtnComponent);

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmBoard({ resetRenderedFilmCount: true });
    this.#renderFilmBoard();
    this.#renderTopRatedList();
    this.#renderMostCommentedList();
  };

  #handleViewAction = (updateType, updatedFilm, scrollPosition) => {
    this.#filmsModel.updateFilm(updateType, updatedFilm, scrollPosition);
  };

  #handleFilmChange = (updatedFilm, scrollPosition) => {
    const allFilms = this.#filmPresenters.get(updatedFilm.id);
    if (allFilms) {
      allFilms.init(updatedFilm, scrollPosition);
    }

    const topRatedFilm = this.#filmPresenters.get(`${updatedFilm.id}-topRated`);
    if (topRatedFilm) {
      topRatedFilm.init(updatedFilm, scrollPosition);
    }

    const mostCommentedFilm = this.#filmPresenters.get(`${updatedFilm.id}-mostComm`);
    if (mostCommentedFilm) {
      mostCommentedFilm.init(updatedFilm, scrollPosition);
    }
  };

  #handleFilmsModelEvent = (updateType, updatedFilm, scrollPosition) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#handleFilmChange(updatedFilm, scrollPosition);
        break;
      case UpdateType.MINOR:
        this.#clearFilmBoard();
        this.#renderFilmBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmBoard({ resetRenderedFilmCount: true, resetSortType: true });
        this.#renderFilmBoard();
        break;
    }
  };

  #handleShowMoreBtnClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilms(films, this.#allFilmsContainerComponent.element);
    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#showMoreBtnComponent);
    }
  };

  #handleСlosePopup = () => {
    this.#filmPresenters.forEach((presenter) => {
      presenter.removeFilmPopup();
    });
  };
}
