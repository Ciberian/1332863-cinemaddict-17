import Observable from '../framework/observable.js';

export default class CommentsModel extends Observable {
  #filmsApiService = null;
  #comments = [];

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  get comments () {
    return this.#comments;
  }

  init = async (film) => {
    try {
      this.#comments = await this.#filmsApiService.getComments(film);
    } catch(err) {
      this.#comments = [];
    }
  };

  addComment = async (updateType, update) => {
    try {
      const response = await this.#filmsApiService.addComment(update.newComment, update.movie);
      const newComment = response.comments[response.comments.length - 1];
      this.#comments = [...this.#comments, newComment];

      this._notify(updateType, this.#adaptToClient(response));

    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.deleteComment.dataset.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#filmsApiService.deleteComment(update.deleteComment);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];

      update.comments = this.#comments;
      this._notify(updateType, update);

    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  };

  #adaptToClient = (film) => {
    const adaptedFilm = {...film,
      movie: {...film.movie,
        filmInfo: {...film.movie['film_info'],
          ageRating: film.movie['film_info']['age_rating'],
          alternativeTitle: film.movie['film_info']['alternative_title'],
          totalRating: film.movie['film_info']['total_rating'],
          release: {
            date: film.movie['film_info']['release']['date'],
            releaseCountry: film.movie['film_info']['release']['release_country']
          }
        },
        userDetails: {
          favorite: film.movie['user_details']['favorite'],
          alreadyWatched: film.movie['user_details']['already_watched'],
          watchingDate: film.movie['user_details']['watching_date'],
          watchlist: film.movie['user_details']['watchlist'],
        }
      }
    };

    delete adaptedFilm.movie['film_info'];
    delete adaptedFilm.movie['user_details'];
    delete adaptedFilm.movie.filmInfo['age_rating'];
    delete adaptedFilm.movie.filmInfo['alternative_title'];
    delete adaptedFilm.movie.filmInfo['total_rating'];

    return adaptedFilm;
  };
}
