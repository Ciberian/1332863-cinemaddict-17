import { getRandomInteger } from '../utils.js';

const commentIds = [];

const getUniqueCommentId = (commentsAmount) => {
  if(!commentIds.length) {
    for (let i = 1; i <= commentsAmount; i++) {
      commentIds.push(i);
    }
  }

  const id = String(commentIds.splice(0, 1));

  return id;
};

const getRandomEmotion = () => {
  const commentEmotions = ['smile', 'sleeping', 'puke', 'angry'];

  const randomIndex = getRandomInteger(0, commentEmotions.length - 1);

  return commentEmotions[randomIndex];
};

const getRandomGenre = () => {
  const genres = ['Drama', 'Comedy', 'Musical', 'Western', 'Cartoon'];

  return genres.splice(getRandomInteger(0, 2), getRandomInteger(1, 3));
};

const getRandomPoster = () => {
  const posters = [
    'images/posters/sagebrush-trail.jpg',
    'images/posters/santa-claus-conquers-the-martians.jpg',
    'images/posters/the-dance-of-life.jpg',
    'images/posters/the-great-flamarion.jpg',
    'images/posters/the-man-with-the-golden-arm.jpg',
    'images/posters/made-for-each-other.png',
    'images/posters/popeye-meets-sinbad.png'
  ];

  const randomIndex = getRandomInteger(0, posters.length - 1);

  return posters[randomIndex];
};

const generateCommentIdArray = () => {
  const randomComments = [];

  while (randomComments.length < getRandomInteger(0, 10)) {
    randomComments.push(getRandomInteger(1, 10));
  }

  const uniqueComments = new Set(randomComments);
  const comments = [...uniqueComments];

  return comments;
};

const generateComment = (commentsAmount) => ({
  id: getUniqueCommentId(commentsAmount),
  author: 'Vasya Pupkin',
  comment: 'A film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  date: '2022-02-11T16:12:32.554Z',
  emotion: getRandomEmotion()
});

const generateFilm = () => ({
  id: 1,
  comments: generateCommentIdArray(),
  filmInfo: {
    title: 'Sagebrush Trail',
    alternativeTitle: 'Laziness Who Sold Themselves',
    totalRating: `${getRandomInteger(4, 9)}.${getRandomInteger(0, 9)}`,
    poster: getRandomPoster(),
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
    genre: getRandomGenre(),
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
