const dotenv = require('dotenv');

const { AppError } = require('../utils/appError.util');

dotenv.config({ path: '/config.env' });

const sendErrorDev = (err, req, res) => {
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, req, res) => {
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: 'fail',
    message: err.message || 'Algo salio mal! ',
  });
};

const handleUniqueEmailError = () => {
  return new AppError('este correo ya esta siendo usado por otro usuario', 400);
};

const handleJWTExpiredError = () => {
  return new AppError('tu sesion ha expirado, inicia sesion nuevamente', 401);
};

const handleJWTError = () => {
  return new AppError('sesion invalida, inicia sesion nuevamente', 401);
};

// err -> AppError
const globalErrorHandler = (err, req, res, next) => {
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'SequelizeUniqueConstraintError') {
      error = handleUniqueEmailError();
    } else if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    } else if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    sendErrorProd(error, req, res);
  }
};

module.exports = { globalErrorHandler };
