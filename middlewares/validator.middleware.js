const { body, validationResult } = require('express-validator');

const { AppError } = require('../utils/appError.util');

const checkResult = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const arrayErrors = errors.array().map(err => err.msg);

    const message = arrayErrors.join(', ');

    return next(new AppError(message, 400));
  }
  next();
};

const createUserValidators = [
  body('name').notEmpty().withMessage('el campo nombre no puede estar vacío'),
  body('lastName')
    .notEmpty()
    .withMessage('el campo apellido no puede estar vacío'),
  body('age').isNumeric().withMessage('el campo edad debe contener un numero'),
  body('email').isEmail().withMessage('debes proporcionar un correo valido'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('la constraseña debe tener minimo 8 caracteres')
    .isAlphanumeric()
    .withMessage('la constraseña debe tener numeros y letras'),
  body('type').notEmpty().withMessage('debes especificar el tipo de usuario'),
  checkResult,
];

module.exports = { createUserValidators };
