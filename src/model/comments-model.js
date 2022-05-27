import Observable from '../framework/observable.js';
import { generateComment } from '../mock/film.js';

const COMMENTS_AMOUNT = 10;

export default class CommentsModel extends Observable {
  #comments = Array.from({length: COMMENTS_AMOUNT}, generateComment);

  get comments () {
    return this.#comments;
  }
}
