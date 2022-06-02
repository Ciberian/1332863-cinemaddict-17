import UserNameView from './view/user-name-view.js';
import FilmBoardPresenter from './presenter/film-board-presenter.js';
import FilmCountView from './view/film-count-view.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import { render } from './framework/render.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
const filmsModel = new FilmsModel();
const filterModel = new FilterModel();
const commentsModel = new CommentsModel();
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const filmBoardPresenter = new FilmBoardPresenter(siteMainElement, filterModel, filmsModel, commentsModel);

render(new UserNameView(), siteHeaderElement);

render(new FilmCountView(filmsModel.films.length), siteFooterStatisticsElement);

filterPresenter.init();
filmBoardPresenter.init();
