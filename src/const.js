const DEFAULT_POSTERS = [
  'images/posters/sagebrush-trail.jpg',
  'images/posters/santa-claus-conquers-the-martians.jpg',
  'images/posters/the-dance-of-life.jpg',
  'images/posters/the-great-flamarion.jpg',
  'images/posters/the-man-with-the-golden-arm.jpg',
  'images/posters/made-for-each-other.png',
  'images/posters/popeye-meets-sinbad.png'
];

const DEFAULT_COMMENTS = [
  'A film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  'A film that changed my life, a true masterpiece.',
  'Нуу, такое... На раз глянуть сойдёт',
  'Что за чушню они сняли, кто на это вообще выделяет деньги.',
  'Безумноумопмрачительнонереальнокрутотенечковый фильм.',
  'Фильм не для массового зрителя, ничтоже сумняшеся его не понять...'
];

const DEFAULT_AUTHORS = ['Vasya Pupkin', 'Pupka Vasin', 'Shwarz', 'Rembo Ibragimivch', 'Thanos', 'Big_Frontender_Boss'];

const DEFAULT_GENRES = ['Drama', 'Comedy', 'Musical', 'Western', 'Cartoon'];

const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const SortType = {
  DEFAULT: 'default',
  DATE_DOWN: 'date-down',
  RATE_DOWN: 'rate-down'
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export { DEFAULT_POSTERS, DEFAULT_COMMENTS, DEFAULT_AUTHORS, DEFAULT_GENRES, EMOTIONS, FilterType, SortType, UserAction, UpdateType };
