import FilmsApiService from './films-api-service.js';
import FilmBoardPresenter from './presenter/film-board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import FilmsModel from './model/films-model.js';

const AUTHORIZATION = 'Basic aV9dsF09wcl9lj8h';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict/';

const siteMainElement = document.querySelector('.main');
const filterModel = new FilterModel();
const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const filmBoardPresenter = new FilmBoardPresenter(siteMainElement, filterModel, filmsModel);

filterPresenter.init();
filmBoardPresenter.init();
filmsModel.init();
