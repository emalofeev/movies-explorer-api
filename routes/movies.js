const moviesRouter = require('express').Router();
const {
  validateCreateMovie,
  validateDeleteMovie,
} = require('../middlewares/validate');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

moviesRouter.get('/', getMovies);
moviesRouter.post('/', validateCreateMovie, createMovie);
moviesRouter.delete('/:movieId', validateDeleteMovie, deleteMovie);

module.exports = moviesRouter;
