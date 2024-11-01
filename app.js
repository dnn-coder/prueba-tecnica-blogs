//Librerias
const express = require('express');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Global err controller
const { globalErrorHandler } = require('./controllers/error.controller');

const { usersRouter } = require('./routes/usesrs.routes');
const { postsRouter } = require('./routes/posts.routes');
const { commentsRouter } = require('./routes/comments.routes');
const { viewsRouter } = require('./routes/views.routes');
const { AppError } = require('./utils/appError.util');

//usasr express e inicializarlo mediante app
const app = express();

//Habilitar el uso de json
app.use(express.json());

//traer el uso de pug

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

//limitar el numero de peticiones de los usuarios
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: 'has excedido el numero permitido de peticiones',
});

app.use(limiter);

app.use('/', viewsRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/posts', postsRouter);
app.use('/api/v1/comments', commentsRouter);

//Manejador global de errores

app.use('*', (req, res, next) => {
  next(
    new AppError(
      `${req.method} ${req.originalUrl} not found in this server`,
      404
    )
  );
});

app.use(globalErrorHandler);

module.exports = { app };
