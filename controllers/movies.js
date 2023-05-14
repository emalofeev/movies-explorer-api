const mongoose = require('mongoose');
const Movie = require('../models/movie');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');
const { STATUS_CODE_CREATED } = require('../utils/constans');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate(['owner'])
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => {
      movie
        .populate('owner')
        .then(() => res.status(STATUS_CODE_CREATED).send(movie))
        .catch(next);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(
          new BadRequest(
            'Переданы некорректные данные при добавлении информации о фильме',
          ),
        );
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFound('Фильм по указанному id не найден'));
        return {};
      }
      if (movie.owner._id.toString() !== req.user._id) {
        next(
          new Forbidden(
            'Попытка удалить информацию о фильме добавленную другим пользователем',
          ),
        );
        return {};
      }
      return Movie.deleteOne().then(res.send(movie));
    })
    .catch(next);
};
