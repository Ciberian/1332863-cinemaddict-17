import dayjs from 'dayjs';

const humanizeFilmDate = (releaseDate, formatType) => dayjs(releaseDate).format(formatType);

const getFilmDuration = (runtime) => {
  const durationInHour = Math.floor(runtime / 60);
  const restMinutes = runtime % 60;

  return `${durationInHour}h ${restMinutes}m`;
};

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const sortFilmsDateDown = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA.filmInfo.release.date, filmB.filmInfo.release.date);

  return weight ?? dayjs(filmA.filmInfo.release.date).diff(dayjs(filmB.filmInfo.release.date));
};

export { humanizeFilmDate, getFilmDuration, updateItem, sortFilmsDateDown };
