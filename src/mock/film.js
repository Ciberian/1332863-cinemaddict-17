import { getRandomInteger, getRandomArrayElement } from '../utils.js';

const posters = [
  'images/posters/sagebrush-trail.jpg',
  'images/posters/santa-claus-conquers-the-martians.jpg',
  'images/posters/the-dance-of-life.jpg',
  'images/posters/the-great-flamarion.jpg',
  'images/posters/the-man-with-the-golden-arm.jpg',
  'images/posters/made-for-each-other.png',
  'images/posters/popeye-meets-sinbad.png'
];

const comments = [
  'A film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  'A film that changed my life, a true masterpiece.',
  'Нуу, такое... На раз глянуть сойдёт',
  'Что за чушню они сняли, кто на это вообще выделяет деньги.',
  'Безумноумопмрачительнонереальнокрутотенечковый фильм.',
  'Фильм не для массового зрителя, ничтоже сумняшемся его не понять...'
];

const authors = ['Vasya Pupkin', 'Pupka Vasin', 'Shwarz', 'Rembo Ibragimivch', 'Thanos', 'Big_Frontender_Boss'];

const emotions = ['smile', 'sleeping', 'puke', 'angry'];

const genres = ['Drama', 'Comedy', 'Musical', 'Western', 'Cartoon'];

const getRandomGenre = (arr) => arr.splice(getRandomInteger(0, 2), getRandomInteger(1, 3));

const generateCommentIdsArray = (commentsAmount) => {
  const randomComments = [];

  while (randomComments.length < getRandomInteger(0, commentsAmount)) {
    randomComments.push(getRandomInteger(1, commentsAmount));
  }

  const uniqueComments = new Set(randomComments);

  return [...uniqueComments];
};

let commentId = 0;
const generateComment = () => ({
  id: commentId++,
  author: getRandomArrayElement(authors),
  comment: getRandomArrayElement(comments),
  date: `2022-02-${getRandomInteger(0, 2)}${getRandomInteger(0, 9)}T16:12:32.554Z`,
  emotion: getRandomArrayElement(emotions)
});

let filmId = 0;
const generateFilm = (commentsAmount) => ({
  id: filmId++,
  comments: generateCommentIdsArray(commentsAmount),
  filmInfo: {
    title: 'Sagebrush Trail',
    alternativeTitle: 'Laziness Who Sold Themselves',
    totalRating: `${getRandomInteger(4, 9)}.${getRandomInteger(0, 9)}`,
    poster: getRandomArrayElement(posters),
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
    genre: getRandomGenre(genres),
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
