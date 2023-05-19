const router = require('express').Router();
const {
  validateCreateUser,
  validateLogin,
} = require('../middlewares/validate');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const NotFound = require('../errors/NotFound');
const PAGE_NOT_FOUND = require('../utils/constans');

router.post('/api/signup', validateCreateUser, createUser);
router.post('/api/signin', validateLogin, login);

router.use(auth);
router.use('/api/users', usersRouter);
router.use('/api/movies', moviesRouter);
router.use('*', (req, res, next) => {
  next(new NotFound(PAGE_NOT_FOUND));
});

module.exports = router;
