import dayjs from 'dayjs';

const humanizeFilmDate = (releaseDate, formatType) => dayjs(releaseDate).format(formatType);

const getFilmDuration = (runtime) => {
  const durationInHour = Math.floor(runtime / 60);
  const restMinutes = runtime % 60;

  return `${durationInHour}h ${restMinutes}m`;
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

export { humanizeFilmDate, getFilmDuration, sortFilmsDateDown };
