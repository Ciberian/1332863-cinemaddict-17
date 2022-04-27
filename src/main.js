import UserNameView from './view/user-name-view.js';
import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import { render } from './render.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilmCountView from './view/film-count-view.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
const filmsPresenter = new FilmsPresenter();

render(new UserNameView(), siteHeaderElement);
render(new FilterView(), siteMainElement);
render(new SortView(), siteMainElement);

filmsPresenter.init(siteMainElement);

render(new FilmCountView(), siteFooterStatisticsElement);
