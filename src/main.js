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
const filmCardPresenter = new FilmCardPresenter();

render(new UserNameView(), siteHeaderElement);
render(new FilterView(), siteMainElement);
render(new SortView(), siteMainElement);

const renderFilmList = new Promise((resolve) => {
  resolve(filmsListPresenter.init(siteMainElement, filmsModel));
});

renderFilmList.then(() => {
  const filmCards = document.querySelectorAll('.film-card__link');

  filmCardPresenter.showPopup(filmCards, filmsModel);
});

render(new FilmCountView(), siteFooterStatisticsElement);
