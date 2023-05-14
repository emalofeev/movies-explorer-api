const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const ConflictingRequest = require('../errors/ConflictingRequest');

const { JWT_SECRET, NODE_ENV } = process.env;

function findUser(res, next, userId) {
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFound('Пользователь по указанному id не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequest('Переданы некорректные данные пользователя'));
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
        next(
          new BadRequest(
            'Переданы некорректные данные при обновлении данных пользователя',
          ),
        );
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
        next(
          new BadRequest(
            'Переданы некорректные данные при создании пользователя',
          ),
        );
        return;
      }
      if (err.code === 11000) {
        next(
          new ConflictingRequest(
            'При регистрации указан email, который уже существует на сервере',
          ),
        );
        return;
      }
      next(err);
    });
};

module.exports.updateProfileUser = (req, res, next) => {
  const { name, about } = req.body;
  return updateUser(req, res, next, { name, about });
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
