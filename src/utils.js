import dayjs from 'dayjs';

const humanizeTaskDueDate = (releaseDate) => dayjs(releaseDate).format('YYYY');

export { humanizeTaskDueDate };
