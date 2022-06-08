import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeFilmDate } from '../utils/films.js';

const createFilmPopupCommentsTemplate = (state) => {
  const { selectedEmotion, typedComment, commentsData } = state;

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

  return `
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
    </div>`;
};

export default class FilmPopupCommentsView extends AbstractStatefulView {
  #film = null;

  constructor(comments, film) {
    super();
    this.#film = film;
    this._state = FilmPopupCommentsView.convertCommentsToState(comments);
    this.#setInnerHandlers();
  }

  get template() {
    return createFilmPopupCommentsTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteCommentHandler(this._callback.deleteComment);
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    document.addEventListener('keydown', this.#formSubmitHandler);
  };

  setDeleteCommentHandler = (callback) => {
    this._callback.deleteComment = callback;
    this.element.querySelectorAll('.film-details__comment-delete').forEach((deleteBtn) => deleteBtn.addEventListener('click', this.#commentDeleteClickHandler));
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#emojiAddHandler);
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentInputHandler);
  };

  #resetForm = () => {
    this._state.typedComment = null;
    this._state.selectedEmotion = null;
    this.updateElement({selectedEmotion: null});
  };

  static convertCommentsToState = (comments) => ({
    commentsData: comments,
    typedComment: null,
    selectedEmotion: null,
  });

  static convertStateToComments = ({selectedEmotion, typedComment}) => (
    {'emotion': selectedEmotion, 'comment': typedComment});

  #emojiAddHandler = (evt) => {
    if (evt.target.nodeName === 'INPUT') {
      const imgName = evt.target.value;

      if (imgName !== this._state.selectedEmotion) {
        const scrollPosition = this.element.scrollTop;
        this.updateElement({selectedEmotion: imgName});
        this.element.scrollTop = scrollPosition;
      }
    }
  };

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      typedComment: evt.target.value,
    });
  };

  #formSubmitHandler = (evt) => {
    if (evt.code === 'Enter' && (evt.ctrlKey || evt.metaKey)) {
      evt.preventDefault();
      this._callback.formSubmit(evt, FilmPopupCommentsView.convertStateToComments(this._state), this.#film);
      this.#resetForm();
    }
  };

  #commentDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteComment(evt, evt.target.closest('.film-details__comment'));
  };
}
