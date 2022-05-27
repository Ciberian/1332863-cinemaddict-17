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
import { sortFilmsDateDown } from '../utils/films.js';
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
  #commentsModel = null;
  #comments = [];
  #filmsPresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor(filmsContainer, filmsModel, commentsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#comments = [...this.#commentsModel.comments];
  }

  get films() {
    switch (this.#currentSortType) {
      case SortType.RATE_DOWN:
        return [...this.#filmsModel.films].sort((filmA, filmB) =>filmB.filmInfo.totalRating - filmA.filmInfo.totalRating);
      case SortType.DATE_DOWN:
        return [...this.#filmsModel.films].sort(sortFilmsDateDown);
      default:
        return this.#filmsModel.films;
    }
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  init = () => {
    this.#renderFilmList();

    if (this.films.length) {
      this.#renderTopRatedList();
      this.#renderMostCommentedList();
    }
  };

  #renderSort = () => {
    if(this.films.length) {
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

  #renderFilms = (films, container, category = null) => {
    films.forEach((film) => this.#renderFilm(film, container, category));
  };

  #renderFilmList = () => {
    const filmCount = this.films.length;
    const films = this.films.slice(0, Math.min(filmCount, FILM_COUNT_PER_STEP));

    render(this.#filmsSectionComponent, this.#filmsContainer);
    if (!filmCount) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    render(this.#filmsListComponent, this.#filmsSectionComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    this.#renderFilms(films, this.#filmsListContainerComponent.element);

    if (filmCount > FILM_COUNT_PER_STEP) {
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

    this.films
      .slice()
      .sort((filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating)
      .slice(0, RATED_FILMS_DISPLAYED)
      .forEach((topRatedFilm) => this.#renderFilm(topRatedFilm, this.#topRatedContainerComponent.element, 'topRated'));
  };

  #renderMostCommentedList = () => {
    render(this.#mostCommentedFilmsComponent, this.#filmsSectionComponent.element);
    render(this.#mostCommentedContainerComponent, this.#mostCommentedFilmsComponent.element);

    this.films
      .slice()
      .sort((filmA, filmB) => filmB.comments.length - filmA.comments.length)
      .slice(0, COMMENTED_FILMS_DISPLAYED)
      .forEach((mostCommentedFilm) => this.#renderFilm(mostCommentedFilm, this.#mostCommentedContainerComponent.element, 'mostComm'));
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

    this.#currentSortType = sortType;
    this.#clearFilmList();
    this.#renderFilmList();
    this.#renderTopRatedList();
    this.#renderMostCommentedList();
  };

  #handleFilmChange = (updatedFilm) => {
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
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilms(films, this.#filmsListContainerComponent.element);
    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#showMoreBtnComponent);
    }
  };

  #handleСlosePopup = () => {
    this.#filmsPresenter.forEach((presenter) => {
      presenter.removeFilmPopup();
    });
  };
}
