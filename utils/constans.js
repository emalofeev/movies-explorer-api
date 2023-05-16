const REGEXP_URL = /(https?:\/\/)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.))(:\d{2,5})?((\/.+)+)?\/?#?/;
const STATUS_CODE_CREATED = 201;
const FIND_USER_NOT_FOUND = 'Пользователь по указанному id не найден';
const FIND_USER_BAD_REQUEST = 'Переданы некорректные данные пользователя';
const UPDATE_USER_BAD_REQUEST = 'Переданы некорректные данные при обновлении данных пользователя';
const UPDATE_USER_CONF_REQUEST = 'При обновлении данных пользователя указан email, который уже существует на сервере';
const CREATE_USER_BAD_REQUEST = 'Переданы некорректные данные при создании пользователя';
const CREATE_USER_CONF_REQUEST = 'При регистрации указан email, который уже существует на сервере';
const CREATE_MOVIE_BAD_REQUEST = 'Переданы некорректные данные при добавлении информации о фильме';
const DELETE_MOVIE_NOT_FOUND = 'Фильм по указанному id не найден';
const DELETE_MOVIE_FORBIDDEN = 'Попытка удалить информацию о фильме добавленную другим пользователем';

module.exports = {
  REGEXP_URL,
  STATUS_CODE_CREATED,
  FIND_USER_NOT_FOUND,
  FIND_USER_BAD_REQUEST,
  UPDATE_USER_BAD_REQUEST,
  UPDATE_USER_CONF_REQUEST,
  CREATE_USER_BAD_REQUEST,
  CREATE_USER_CONF_REQUEST,
  CREATE_MOVIE_BAD_REQUEST,
  DELETE_MOVIE_NOT_FOUND,
  DELETE_MOVIE_FORBIDDEN,
};
