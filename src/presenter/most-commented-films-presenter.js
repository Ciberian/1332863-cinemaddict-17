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
  #filmsModel = null;
  #commentsModel = null;
  #boardContainer = null;
  #mostCommentedFilmPresenters = new Map();

  constructor(filmsModel, commentsModel, boardContainer) {
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#films = [...this.#filmsModel.films];
    this.#boardContainer = boardContainer;

    this.#filmsModel.addObserver(this.#handleMostCommentedFilmsModelEvent);
    this.#commentsModel.addObserver(this.#handleMostCommentedFilmsModelEvent);
  }

  init = () => {
    this.#renderMostCommentedFilms();
  };

  #renderFilm = (film, container) => {
    const filmPresenter = new FilmPresenter(this.#handleViewAction, container, this.#filmsModel, this.#commentsModel);
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
        if ('movie' in updatedFilm && this.#mostCommentedFilmPresenters.get(updatedFilm.movie.id)) {
          this.#mostCommentedFilmPresenters.get(updatedFilm.movie.id).init(updatedFilm.movie);
          break;
        }

        if (this.#mostCommentedFilmPresenters.get(updatedFilm.id)) {
          this.#mostCommentedFilmPresenters.get(updatedFilm.id).init(updatedFilm);
        }
        break;
      case UpdateType.MINOR:
        if (this.#mostCommentedFilmPresenters.get(updatedFilm.id)) {
          this.#mostCommentedFilmPresenters.get(updatedFilm.id).init(updatedFilm);
        }
        break;
      case UpdateType.MAJOR:
        this.clearMostCommentedFilmList();
        this.#renderMostCommentedFilms();
        break;
    }
  };
}
