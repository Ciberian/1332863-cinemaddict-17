import AbstractView from '../framework/view/abstract-stateful-view.js';
import { humanizeFilmDate, getFilmDuration } from '../utils/films.js';

const createFilmPopupTemplate = (film) => {
  const {
    filmInfo: {
      title,
      alternativeTitle,
      totalRating,
      ageRating,
      director,
      writers,
      actors,
      genre,
      poster,
      description,
      runtime,
      release: { date, releaseCountry },
    }
  } = film;

  const releaseDate = date !== null ? humanizeFilmDate(date, 'DD MMMM YYYY') : '';

  const getGenreTemplates = () => genre.reduce((htmlTemplate, gen) => (htmlTemplate += `<span class="film-details__genre">${gen}</span>`), '');

  return `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers.length > 1 ? writers.join(', ') : writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors.length > 1 ? actors.join(', ') : actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${getFilmDuration(runtime)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genre.length > 1 ? 'Genres' : 'Genre'}</td>
                  <td class="film-details__cell">${getGenreTemplates()}</td>
                </tr>
              </table>

              <p class="film-details__film-description">${description}</p>
            </div>
          </div>
        </div>
      </form>
  </section>`;
};

export default class FilmPopupView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmPopupTemplate(this.#film);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickHandler);
  };

  setKeydownHandler = (callback) => {
    this._callback.keydown = callback;
    document.addEventListener('keydown', this.#documentKeydownHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
    document.removeEventListener('keydown', this.#documentKeydownHandler);
  };

  #documentKeydownHandler = (evt) => {
    if (evt.code === 'Escape') {
      evt.preventDefault();
      this._callback.keydown();
      document.removeEventListener('keydown', this.#documentKeydownHandler);
    }
  };
}
