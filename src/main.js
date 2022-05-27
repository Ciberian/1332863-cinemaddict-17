import UserNameView from './view/user-name-view.js';
import FilterView from './view/filter-view.js';
import FilmsListPresenter from './presenter/films-list-presenter.js';
import FilmCountView from './view/film-count-view.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import { generateFilter } from './mock/filter.js';
import { render } from './framework/render.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filmsListPresenter = new FilmsListPresenter(siteMainElement, filmsModel, commentsModel);

render(new UserNameView(), siteHeaderElement);

const filters = generateFilter(filmsModel.films);
render(new FilterView(filters), siteMainElement);

render(new FilmCountView(filmsModel.films.length), siteFooterStatisticsElement);

filmsListPresenter.init();
