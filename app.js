require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const helmet = require('helmet');
const limiter = require('./middlewares/rateLimit');
const routes = require('./routes/index');
const errorsMiddlewares = require('./middlewares/errorsMiddlewares');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { PORT, DB_ADDRESS } = require('./config');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(limiter);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorsMiddlewares);

mongoose.connect(DB_ADDRESS);

app.listen(PORT, () => {});
