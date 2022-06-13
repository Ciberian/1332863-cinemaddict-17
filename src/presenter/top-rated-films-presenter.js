import FilmPresenter from './film-presenter.js';
import FilmsContainerView from '../view/films-container-view.js';
import TopRatedFilmsView from '../view/top-rated-films-view.js';
import { render, remove } from '../framework/render.js';
import { UpdateType } from '../const.js';

const TOP_RATED_FILMS_DISPLAYED = 2;

export default class TopRatedFilmsPresenter {
  #topRatedContainerComponent = new FilmsContainerView();
  #topRatedFilmsComponent = new TopRatedFilmsView();

  #filmsModel = null;
  #commentsModel = null;
  #boardContainer = null;
  #topRatedFilmPresenters = new Map();

  constructor(filmsModel, commentsModel, boardContainer) {
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#boardContainer = boardContainer;

    this.#filmsModel.addObserver(this.#handleTopRatedFilmsModelEvent);
  }

  get films() {
    return this.#filmsModel.films;
  }

  init = () => {
    this.#renderTopRatedFilmList();
  };

  #renderFilm = (film, container) => {
    const filmPresenter = new FilmPresenter(container, this.#filmsModel, this.#commentsModel);
    filmPresenter.init(film);
    this.#topRatedFilmPresenters.set(film.id, filmPresenter);
  };

  #renderTopRatedFilmList = () => {
    if (this.films.every((film) => film.filmInfo.totalRating === 0.0)) {
      return;
    }

    render(this.#topRatedFilmsComponent, this.#boardContainer);
    render(this.#topRatedContainerComponent, this.#topRatedFilmsComponent.element);

    this.films
      .slice()
      .sort((filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating)
      .slice(0, TOP_RATED_FILMS_DISPLAYED)
      .forEach((topRatedFilm) => {
        if (topRatedFilm.filmInfo.totalRating !== 0.0) {
          this.#renderFilm(topRatedFilm, this.#topRatedContainerComponent.element);
        }
      });
  };

  clearTopRatedFilmList = () => {
    this.#topRatedFilmPresenters.forEach((presenter) => presenter.destroy());
    this.#topRatedFilmPresenters.clear();

    remove(this.#topRatedContainerComponent);
    remove(this.#topRatedFilmsComponent);
  };

  #handleTopRatedFilmsModelEvent = (updateType, updatedFilm) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#topRatedFilmPresenters.get(updatedFilm.id)) {
          this.#topRatedFilmPresenters.get(updatedFilm.id).init(updatedFilm);
        }
        break;
      case UpdateType.MINOR:
        if (this.#topRatedFilmPresenters.get(updatedFilm.id)) {
          this.#topRatedFilmPresenters.get(updatedFilm.id).init(updatedFilm);
        }
        break;
      case UpdateType.MAJOR:
        this.clearTopRatedFilmList();
        this.#renderTopRatedFilmList();
        break;
    }
  };
}
