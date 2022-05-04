import { getRandomInteger, getRandomArrayElement } from '../utils.js';

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
  'Фильм не для массового зрителя, ничтоже сумняшемся его не понять...'
];

const DEFAULT_AUTHORS = ['Vasya Pupkin', 'Pupka Vasin', 'Shwarz', 'Rembo Ibragimivch', 'Thanos', 'Big_Frontender_Boss'];

const DEFAULT_GENRES = ['Drama', 'Comedy', 'Musical', 'Western', 'Cartoon'];

const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];

const getRandomGenre = (arr) => arr.slice(getRandomInteger(0, 2), getRandomInteger(2, 3));

const generateCommentIds = (commentsAmount) => {
  const randomComments = [];

  while (randomComments.length < getRandomInteger(4, commentsAmount)) {
    randomComments.push(getRandomInteger(1, commentsAmount));
  }

  const uniqComments = new Set(randomComments);

  return [...uniqComments];
};

let commentId = 0;
const generateComment = () => ({
  id: ++commentId,
  author: getRandomArrayElement(DEFAULT_AUTHORS),
  comment: getRandomArrayElement(DEFAULT_COMMENTS),
  date: `2022-02-${getRandomInteger(0, 2)}${getRandomInteger(0, 9)}T16:12:32.554Z`,
  emotion: getRandomArrayElement(EMOTIONS)
});

let filmId = 0;
const generateFilm = (commentsAmount) => ({
  id: ++filmId,
  comments: generateCommentIds(commentsAmount),
  filmInfo: {
    title: 'Sagebrush Trail',
    alternativeTitle: 'Laziness Who Sold Themselves',
    totalRating: `${getRandomInteger(4, 9)}.${getRandomInteger(0, 9)}`,
    poster: getRandomArrayElement(DEFAULT_POSTERS),
    ageRating: 18,
    director: 'Tom Ford',
    writers: [
      'Takeshi Kitano'
    ],
    actors: [
      'Morgan Freeman',
      'Erich von Stroheim'
    ],
    release: {
      date: `19${getRandomInteger(2, 9)}${getRandomInteger(0, 9)}-05-11T00:00:00.000Z`,
      releaseCountry: 'Finland'
    },
    runtime: getRandomInteger(30, 150),
    genre: getRandomGenre(DEFAULT_GENRES),
    description: 'Oscar-winning film, a war drama about two young people, from the creators of timeless classic "Nu, Pogodi!" and "Alice in Wonderland", with the best fight scenes since Bruce Lee.'
  },
  userDetails: {
    watchlist: Boolean(getRandomInteger(0, 1)),
    alreadyWatched: Boolean(getRandomInteger(0, 1)),
    watchingDate: '2019-04-12T16:12:32.554Z',
    favorite: Boolean(getRandomInteger(0, 1))
  }
});

export { generateComment, generateFilm };
