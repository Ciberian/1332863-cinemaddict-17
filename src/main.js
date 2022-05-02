import UserNameView from './view/user-name-view.js';
import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import FilmsListPresenter from './presenter/films-list-presenter.js';
import FilmCardPresenter from './presenter/film-card-presenter.js';
import FilmCountView from './view/film-count-view.js';
import FilmsModel from './model/films-model.js';
import { render } from './render.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
const filmsModel = new FilmsModel();
const filmsListPresenter = new FilmsListPresenter();

render(new UserNameView(), siteHeaderElement);
render(new FilterView(), siteMainElement);
render(new SortView(), siteMainElement);

const promise = new Promise((resolve) => {
  resolve(filmsListPresenter.init(siteMainElement, filmsModel));
});

promise.then(() => {
  const filmCards = document.querySelectorAll('.film-card');
  const filmCardPresenter = new FilmCardPresenter(filmCards, filmsModel);

  filmCardPresenter.showPopup();
});

render(new FilmCountView(), siteFooterStatisticsElement);
