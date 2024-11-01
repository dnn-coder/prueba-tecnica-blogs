//Utilidades
const { AppError } = require('../utils/appError.util');
const { catchAsync } = require('../utils/catchAsync');
//Models
const { User } = require('../models/users.model');
//Libraries
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

//Consfigurations
dotenv.config({ path: './config.env' });

const protectSession = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('invalid session', 404));
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findOne({
    where: { id: decoded.id, status: 'active' },
  });

  if (!user) {
    return next(
      new AppError('the owner of this token doesnt exist anymore', 403)
    );
  }
  req.sessionUser = user;
  next();
});

//creat un middelware para garantizar que el susario en sesion es el que puede editarse a si mismo
//1. obtener id de usuario en sesion
//2. validar si el susario que se intenta editar o eliminar es el mismo usuario en sesion
//3. si los ids no coinciden retornar un error 403
//4. si coinciden actualizar o eliminar el usuario

const protectUserAccount = async (req, res, next) => {
  const { sessionUser, user } = req;
  //const { id } = req.params;

  if (sessionUser.id !== user.id) {
    return next(new AppError('you do not own this account', 403));
  }

  next();
};

module.exports = { protectSession, protectUserAccount };
