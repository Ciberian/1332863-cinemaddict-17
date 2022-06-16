import { FilterType } from '../const';

const filmsFilter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter(({ userDetails }) => userDetails.watchlist),
  [FilterType.HISTORY]: (films) => films.filter(({ userDetails }) => userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (films) => films.filter(({ userDetails }) => userDetails.favorite),
};

export { filmsFilter };
