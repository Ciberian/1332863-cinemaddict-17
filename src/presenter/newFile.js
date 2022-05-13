import FilmCardView from '../view/film-card-view.js';
import { render } from '../framework/render.js';
import { addFilmPopup } from './film-presenter';

export default FilmPresenter;
{
  #film = null;
  #container = null;

  constructor(film, container); {
    this.#film = film;
    this.#container = container;
  }

  #renderFilm = () => {
    const filmCardComponent = new FilmCardView(this.#film);
    filmCardComponent.setClickHandler(() => addFilmPopup(film, this.#comments));
    render(filmCardComponent, container);
  };
}
;
