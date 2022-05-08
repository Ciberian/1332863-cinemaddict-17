import { FilterType } from '../const';

const filter = {
  [FilterType.WATCHLIST]: (films) => films.filter(({userDetails}) => userDetails.watchlist),
  [FilterType.HISTORY]: (films) => films.filter(({userDetails}) => userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (films) => films.filter(({userDetails}) => userDetails.favorite),
};

export const generateFilter = (films) => Object.entries(filter).map(
  ([filterName, filterFilms]) => ({
    name: filterName,
    count: filterFilms(films).length,
  }),
);
