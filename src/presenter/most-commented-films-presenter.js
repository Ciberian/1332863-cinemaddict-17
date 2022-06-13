import FilmPresenter from './film-presenter.js';
import FilmsContainerView from '../view/films-container-view.js';
import MostCommentedFilmsView from '../view/most-commented-films-view.js';
import { render, remove } from '../framework/render.js';
import { UpdateType } from '../const.js';

const COMMENTED_FILMS_DISPLAYED = 2;

export default class MostCommentedFilmsPresenter {
  #mostCommentedFilmsComponent = new MostCommentedFilmsView();
  #mostCommentedContainerComponent = new FilmsContainerView();

  #filmsModel = null;
  #commentsModel = null;
  #boardContainer = null;
  #mostCommentedFilmPresenters = new Map();

  constructor(filmsModel, commentsModel, boardContainer) {
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#boardContainer = boardContainer;

    this.#filmsModel.addObserver(this.#handleMostCommentedFilmsModelEvent);
    this.#commentsModel.addObserver(this.#handleMostCommentedFilmsModelEvent);
  }

  get films() {
    return this.#filmsModel.films;
  }

  init = () => {
    this.#renderMostCommentedFilms();
  };

  #renderFilm = (film, container) => {
    const filmPresenter = new FilmPresenter(container, this.#filmsModel, this.#commentsModel);
    filmPresenter.init(film);
    this.#mostCommentedFilmPresenters.set(film.id, filmPresenter);
  };

  #renderMostCommentedFilms = () => {
    if (this.films.every((film) => film.comments.length === 0)) {
      return;
    }

    render(this.#mostCommentedFilmsComponent, this.#boardContainer);
    render(this.#mostCommentedContainerComponent, this.#mostCommentedFilmsComponent.element);
    this.films
      .slice()
      .sort((filmA, filmB) => filmB.comments.length - filmA.comments.length)
      .slice(0, COMMENTED_FILMS_DISPLAYED)
      .forEach((mostCommentedFilm) => {
        if (mostCommentedFilm.comments.length !== 0) {
          this.#renderFilm(mostCommentedFilm, this.#mostCommentedContainerComponent.element);
        }
      });
  };

  clearMostCommentedFilmList = () => {
    this.#mostCommentedFilmPresenters.forEach((presenter) => presenter.destroy());
    this.#mostCommentedFilmPresenters.clear();

    remove(this.#mostCommentedContainerComponent);
    remove(this.#mostCommentedFilmsComponent);
  };

  #handleMostCommentedFilmsModelEvent = (updateType, updatedFilm) => {
    switch (updateType) {
      case UpdateType.PATCH:
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
