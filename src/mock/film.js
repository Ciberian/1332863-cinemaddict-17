
export const generateFilm = () => ({
  id: 0,
  comments: [
    '$Comment.id$', '$Comment.id$'
  ],
  filmInfo: {
    title: 'Sagebrush Trail',
    alternativeTitle: 'Laziness Who Sold Themselves',
    totalRating: 5.3,
    poster: 'images/posters/sagebrush-trail.jpg',
    ageRating: 0,
    director: 'Tom Ford',
    writers: [
      'Takeshi Kitano'
    ],
    actors: [
      'Morgan Freeman'
    ],
    release: {
      date: '1959-05-11T00:00:00.000Z',
      releaseCountry: 'Finland'
    },
    runtime: 77,
    genre: [
      'Comedy'
    ],
    description: 'Oscar-winning film, a war drama about two young people, from the creators of timeless classic "Nu, Pogodi!" and "Alice in Wonderland", with the best fight scenes since Bruce Lee.'
  },
  userDetails: {
    watchlist: false,
    alreadyWatched: true,
    watchingDate: '2019-04-12T16:12:32.554Z',
    favorite: false
  }
});
