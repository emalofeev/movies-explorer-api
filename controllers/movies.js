const mongoose = require('mongoose');
const Movie = require('../models/movie');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');
const {
  STATUS_CODE_CREATED,
  CREATE_MOVIE_BAD_REQUEST,
  DELETE_MOVIE_NOT_FOUND,
  DELETE_MOVIE_FORBIDDEN,
} = require('../utils/constans');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
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
        next(new BadRequest(CREATE_MOVIE_BAD_REQUEST));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFound(DELETE_MOVIE_NOT_FOUND));
        return {};
      }
      if (movie.owner._id.toString() !== req.user._id) {
        next(new Forbidden(DELETE_MOVIE_FORBIDDEN));
        return {};
      }
      return movie.deleteOne().then(() => res.send(movie));
    })
    .catch(next);
};
