const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const ConflictingRequest = require('../errors/ConflictingRequest');
const {
  FIND_USER_NOT_FOUND,
  FIND_USER_BAD_REQUEST,
  UPDATE_USER_BAD_REQUEST,
  UPDATE_USER_CONF_REQUEST,
  CREATE_USER_BAD_REQUEST,
  CREATE_USER_CONF_REQUEST,
} = require('../utils/constans');

const { JWT_SECRET, NODE_ENV } = process.env;

function findUser(res, next, userId) {
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFound(FIND_USER_NOT_FOUND));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequest(FIND_USER_BAD_REQUEST));
        return;
      }
      next(err);
    });
}

function updateUser(req, res, next, property) {
  User.findByIdAndUpdate(req.user._id, property, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest(UPDATE_USER_BAD_REQUEST));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictingRequest(UPDATE_USER_CONF_REQUEST));
        return;
      }
      next(err);
    });
}

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  return findUser(res, next, _id);
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      const objUser = user.toObject();
      delete objUser.password;
      res.send(objUser);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest(CREATE_USER_BAD_REQUEST));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictingRequest(CREATE_USER_CONF_REQUEST));
        return;
      }
      next(err);
    });
};

module.exports.updateProfileUser = (req, res, next) => {
  const { email, name } = req.body;
  return updateUser(req, res, next, { email, name });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          {
            expiresIn: '7d',
          },
        ),
      });
    })
    .catch(next);
};
