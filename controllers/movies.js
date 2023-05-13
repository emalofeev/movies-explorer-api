const mongoose = require('mongoose');
const Movie = require('../models/movie');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');
const { STATUS_CODE_CREATED } = require('../utils/constans');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate(['owner', 'likes'])
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Movie.create({ name, link, owner })
    .then((movie) => {
      movie
        .populate('owner')
        .then(() => res.status(STATUS_CODE_CREATED).send(movie))
        .catch(next);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(
          new BadRequest('Переданы некорректные данные при создании карточки'),
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
        next(new NotFound('Карточка по указанному _id не найдена'));
        return {};
      }
      if (movie.owner._id.toString() !== req.user._id) {
        next(new Forbidden('Попытка удалить чужую карточку'));
        return {};
      }
      return Movie.deleteOne().then(res.send(movie));
    })
    .catch(next);
};
