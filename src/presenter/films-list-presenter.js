import FilmsSectionView from '../view/films-section-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmPresenter from './film-presenter.js';
import ListEmptyView from '../view/list-empty-view.js';
import ShowMoreBtnView from '../view/show-more-btn-view.js';
import TopRatedFilmsView from '../view/top-rated-films-view.js';
import MostCommentedFilmsView from '../view/most-commented-films-view.js';
import { render, remove } from '../framework/render.js';
import { updateItem } from '../utils.js';

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

  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmsContainer = null;
  #filmsModel = null;
  #films = [];
  #comments = [];
  #filmsPresenter = new Map();

  constructor(filmsContainer, filmsModel) {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
    this.#comments = [...this.#filmsModel.comments];
  }

  init = () => {
    this.#films = [...this.#filmsModel.films];

    this.#renderFilmList();

    if (this.#films.length) {
      this.#renderTopRatedList();
      this.#renderMostCommentedList();
    }
  };

  #handleFilmChange = (updatedFilm, container) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#filmsPresenter.get(updatedFilm.id).init(updatedFilm, container);
  };

  #renderFilm = (film, container) => {
    const filmPresenter = new FilmPresenter(this.#comments, this.#handleFilmChange);

    filmPresenter.init(film, container);
    this.#filmsPresenter.set(film.id, filmPresenter);
  };

  #renderNoFilms = () => {
    render(new ListEmptyView(), this.#filmsSectionComponent.element);
  };

  #renderShowMoreBtn = () => {
    render(this.#showMoreBtnComponent, this.#filmsListComponent.element);
    this.#showMoreBtnComponent.setClickHandler(this.#handleShowMoreBtnClick);
  };

  #clearFilmList = () => {
    this.#filmsPresenter.forEach((presenter) => presenter.destroy());
    this.#filmsPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#showMoreBtnComponent);
  };

  #renderFilmList = () => {
    render(this.#filmsSectionComponent, this.#filmsContainer);

    if (!this.#films.length) {
      this.#renderNoFilms();
      return;
    }

    render(this.#filmsListComponent, this.#filmsSectionComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    for (let i = 0; i < Math.min(this.#films.length, FILM_COUNT_PER_STEP); i++) {
      this.#renderFilm(this.#films[i], this.#filmsListContainerComponent.element);
    }

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreBtn();
    }
  };

  #renderTopRatedList = () => {
    render(this.#topRatedFilmsComponent, this.#filmsSectionComponent.element);
    render(this.#topRatedContainerComponent, this.#topRatedFilmsComponent.element);

    this.#films
      .slice()
      .sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating)
      .slice(0, RATED_FILMS_DISPLAYED)
      .forEach((topRatedFilm) => this.#renderFilm(topRatedFilm, this.#topRatedContainerComponent.element));
  };

  #renderMostCommentedList = () => {
    render(this.#mostCommentedFilmsComponent, this.#filmsSectionComponent.element);
    render(this.#mostCommentedContainerComponent, this.#mostCommentedFilmsComponent.element);

    this.#films
      .slice()
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, COMMENTED_FILMS_DISPLAYED)
      .forEach((mostCommentedFilm) => this.#renderFilm(mostCommentedFilm, this.#mostCommentedContainerComponent.element));
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
}
