import FilmPresenter from './film-presenter.js';
import FilmsContainerView from '../view/films-container-view.js';
import MostCommentedFilmsView from '../view/most-commented-films-view.js';
import { render, remove } from '../framework/render.js';
import { UpdateType } from '../const.js';

const COMMENTED_FILMS_DISPLAYED = 2;

export default class MostCommentedFilmsPresenter {
  #mostCommentedFilmsComponent = new MostCommentedFilmsView();
  #mostCommentedContainerComponent = new FilmsContainerView();

  #films = [];
  #comments = [];
  #filmsModel = null;
  #commentsModel = null;
  #boardContainer = null;
  #mostCommentedFilmPresenters = new Map();

  constructor(filmsModel, commentsModel, boardContainer) {
    this.#filmsModel = filmsModel;
    this.#films = [...this.#filmsModel.films];
    this.#commentsModel = commentsModel;
    this.#comments = [...this.#commentsModel.comments];
    this.#boardContainer = boardContainer;

    this.#filmsModel.addObserver(this.#handleMostCommentedFilmsModelEvent);
  }

  init = () => {
    this.#renderMostCommentedFilms();
  };

  #renderFilm = (film, container) => {
    const filmPresenter = new FilmPresenter(this.#comments, this.#handleViewAction, container, this.#filmsModel);
    filmPresenter.init(film);
    this.#mostCommentedFilmPresenters.set(film.id, filmPresenter);
  };

  #renderMostCommentedFilms = () => {
    render(this.#mostCommentedFilmsComponent, this.#boardContainer);
    render(this.#mostCommentedContainerComponent, this.#mostCommentedFilmsComponent.element);

    this.#films
      .slice()
      .sort((filmA, filmB) => filmB.comments.length - filmA.comments.length)
      .slice(0, COMMENTED_FILMS_DISPLAYED)
      .forEach((mostCommentedFilm) => this.#renderFilm(mostCommentedFilm, this.#mostCommentedContainerComponent.element));
  };

  clearMostCommentedFilmList = () => {
    this.#mostCommentedFilmPresenters.forEach((presenter) => presenter.destroy());
    this.#mostCommentedFilmPresenters.clear();

    remove(this.#mostCommentedContainerComponent);
    remove(this.#mostCommentedFilmsComponent);
  };

  #handleViewAction = (updateType, updatedFilm) => {
    this.#filmsModel.updateFilm(updateType, updatedFilm);
  };

  #handleMostCommentedFilmsModelEvent = (updateType, updatedFilm) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#mostCommentedFilmPresenters.get(updatedFilm.id)) {
          this.#mostCommentedFilmPresenters.get(updatedFilm.id).init(updatedFilm);
        }
        break;
      case UpdateType.MINOR:
        this.clearMostCommentedFilmList();
        this.#renderMostCommentedFilms();
        break;
      case UpdateType.MAJOR:
        this.clearMostCommentedFilmList();
        this.#renderMostCommentedFilms();
        break;
    }
  };
}
