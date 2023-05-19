const usersRouter = require('express').Router();
const { validateUpdateProfileUser } = require('../middlewares/validate');
const { getCurrentUser, updateProfileUser } = require('../controllers/users');

usersRouter.get('/me', getCurrentUser);
usersRouter.patch('/me', validateUpdateProfileUser, updateProfileUser);

module.exports = usersRouter;
