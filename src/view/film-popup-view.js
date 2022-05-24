import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeFilmDate, getFilmDuration } from '../utils/films.js';

const createFilmPopupTemplate = (state) => {
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
    },
    userDetails: { watchlist, alreadyWatched, favorite },
    selectedEmotion,
    typedComment,
    commentsData
  } = state;

  const releaseDate = date !== null ? humanizeFilmDate(date, 'DD MMMM YYYY') : '';
  const filmInWatchlistClassName = watchlist ? 'film-details__control-button--active' : '';
  const alreadyWatchedClassName = alreadyWatched ? 'film-details__control-button--active' : '';
  const favoriteFilmClassName = favorite ? 'film-details__control-button--active' : '';

  const getGenreTemplates = () => genre.reduce((htmlTemplate, gen) => (htmlTemplate += `<span class="film-details__genre">${gen}</span>`), '');

  const createComments = () => commentsData.reduce(
    (htmlTemplate, { id, author, comment, date: commentDate, emotion }) =>
      (htmlTemplate += `<li class="film-details__comment" data-id=${id}>
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
        </span>
        <div>
          <p class="film-details__comment-text">${comment}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${humanizeFilmDate(commentDate, 'YYYY/MMMM/DD HH:MM')}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>`), '');

  const createEmotionTemplate = () => selectedEmotion !== null ? `<img src="./images/emoji/${selectedEmotion}.png" width="55" height="55" alt="emoji-${selectedEmotion}">`: '';

  const createEmojiList = () => ['smile', 'sleeping', 'puke', 'angry'].reduce((htmlTemplate, emoji) => (
    htmlTemplate += `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${selectedEmotion === emoji ? 'checked' : ''}>
      <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
    </label>`), '');

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

          <section class="film-details__controls">
            <button type="button" class="film-details__control-button film-details__control-button--watchlist ${filmInWatchlistClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" class="film-details__control-button film-details__control-button--watched ${alreadyWatchedClassName}" id="watched" name="watched">Already watched</button>
            <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteFilmClassName}" id="favorite" name="favorite">Add to favorites</button>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsData.length}</span></h3>

            <ul class="film-details__comments-list">${createComments()}</ul>

            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">${createEmotionTemplate()}</div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${typedComment !== null ? typedComment : ''}</textarea>
              </label>
              <div class="film-details__emoji-list">${createEmojiList()}</div>
            </div>
          </section>
        </div>
      </form>
  </section>`;
};

export default class FilmPopupView extends AbstractStatefulView {
  #commentData = null;

  constructor(film, comments) {
    super();
    this._state = FilmPopupView.convertFilmToState(film, comments);
    this.#setInnerHandlers();
  }

  get template() {
    return createFilmPopupTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.setClickHandler(this._callback.click);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.#setInnerHandlers();
  };

  #emojiAddHandler = (evt, imgSrc) => {
    evt.preventDefault();
    let imgName = imgSrc.split('/');
    imgName = imgName[imgName.length-1].replace(/\.([A-Za-z]{3,4})/, '');

    if (imgName !== this._state.selectedEmotion) {
      const scrollPosition = this.element.scrollTop;
      this.updateElement({selectedEmotion: imgName});
      this.element.scrollTop = scrollPosition;
    }
  };

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      typedComment: evt.target.value,
    });
  };

  #commentDeleteHandler = (evt) => {
    evt.preventDefault();
    const commentId = evt.target.closest('.film-details__comment').dataset.id;
    const updatedComments = this._state.commentsData.filter((comment) => comment.id !== Number(commentId));

    const scrollPosition = this.element.scrollTop;
    this.updateElement({commentsData: updatedComments});
    this.element.scrollTop = scrollPosition;
  };

  #setInnerHandlers = () => {
    this.element.querySelectorAll('.film-details__emoji-list img')
      .forEach((img) => img.addEventListener('click', (evt) => this.#emojiAddHandler(evt, img.src)));
    this.element.querySelectorAll('.film-details__comment-delete')
      .forEach((commentDeleteBtn) => commentDeleteBtn.addEventListener('click', this.#commentDeleteHandler));
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentInputHandler);
  };

  static convertFilmToState = (film, comments) => ({...film,
    commentsData: comments,
    typedComment: null,
    selectedEmotion: null,
  });

  static convertStateToCommentData = ({selectedEmotion, typedComment}) => {
    this.#commentData = {emotion: selectedEmotion, comment: typedComment};
  };

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
    this.element.querySelector('.film-details__control-button--favorite').classList.toggle('film-details__control-button--active');
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
    this.element.querySelector('.film-details__control-button--watched').classList.toggle('film-details__control-button--active');
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
    this.element.querySelector('.film-details__control-button--watchlist').classList.toggle('film-details__control-button--active');
  };
}
