import UserNameView from './view/user-name-view.js';
import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import FilmsListPresenter from './presenter/films-list-presenter.js';
import FilmCountView from './view/film-count-view.js';
import FilmsModel from './model/films-model.js';
import { generateFilter } from './mock/filter.js';
import { render } from './framework/render.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
const filmsModel = new FilmsModel();
const filmsListPresenter = new FilmsListPresenter(siteMainElement, filmsModel);

render(new UserNameView(), siteHeaderElement);

const filters = generateFilter(filmsModel.films);
render(new FilterView(filters), siteMainElement);

if(filmsModel.films.length) {
  render(new SortView(), siteMainElement);
}

render(new FilmCountView(filmsModel.films.length), siteFooterStatisticsElement);

filmsListPresenter.init();
