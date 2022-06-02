import { remove, render, replace } from '../framework/render';
import FilmCardView from '../view/film-card-view';
import { UserAction, UpdateType } from '../const';
import PopupPresenter from './popup-presenter';

const Mode = {
  DEFAULT: 'DEFAULT',
};

export default class FilmPresenter {
  #filmListContainer = null;
  #changeFilm = null;
  #filmComponent = null;
  #film = null;
  #filmsModel = null;
  #commentsModel = null;
  #filmPopup = null;
  #filmComments = null;
  #comments = [];
  #mode = Mode.DEFAULT;

  constructor(filmListContainer, filmsModel, commentsModel, changeFilm) {
    this.#filmListContainer = filmListContainer;
    this.#filmsModel = filmsModel;
    this.#changeFilm = changeFilm;
    this.#commentsModel = commentsModel;

    this.#filmsModel.addObserver(this.#handlePopupModelEvent);
  }

  #handlePopupModelEvent = (updateType, updatedFilm) => {
    if (document.body.querySelector('.film-details')) {
      this.showPopup(updatedFilm);
    }
  };

  init(film) {
    this.#film = film;
    const prevFilmComponent = this.#filmComponent;
    this.#filmComponent = new FilmCardView(film);
    this.#filmComponent.setWatchlistClickHandler(this.#onWatchlistClick);
    this.#filmComponent.setWatchedClickHandler(this.#onWatchedClick);
    this.#filmComponent.setFavouriteClickHandler(this.#onFavouriteClick);
    this.#filmComponent.setClickHandler(() => this.#onCardClick(film));
    if (!prevFilmComponent) {
      render(this.#filmComponent, this.#filmListContainer);
      return;
    }
    if (this.#filmListContainer.contains(prevFilmComponent.element)) {
      replace(this.#filmComponent, prevFilmComponent);
    }
    remove(prevFilmComponent);
  }

  destroy = () => remove(this.#filmComponent);

  #onCardClick = (film) => {
    if(document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
      document.body.classList.toggle('hide-overflow');
    }
    this.#showPopUp(film);
  };

  #showPopUp = (film) => {
    const siteFooterElement = document.querySelector('.footer');
    this.#filmPopup = new PopupPresenter(siteFooterElement, film, this.#filmsModel, this.#commentsModel, this.#changeFilm);
    this.#filmPopup.init(film);
  };

  #onWatchlistClick = () => {
    this.#changeFilm(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}},
    );
    if (this.#filmPopup) {
      document.body.classList.toggle('hide-overflow');
      this.#showPopUp(this.#film);
    }
  };

  #onWatchedClick = () => {
    this.#changeFilm(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}},
    );
    if (this.#filmPopup) {
      document.body.classList.toggle('hide-overflow');
      this.#showPopUp(this.#film);
    }
  };

  #onFavouriteClick = () => {
    this.#changeFilm(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}},
    );
    if (this.#filmPopup) {
      document.body.classList.toggle('hide-overflow');
      this.#showPopUp(this.#film);
    }
  };
}
