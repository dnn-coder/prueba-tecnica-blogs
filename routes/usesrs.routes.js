const express = require('express');
const {
  deleteUser,
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  login,
} = require('../controllers/users.controllers');

//Middlewares

const { createUserValidators } = require('../middlewares/validator.middleware');

const { userExists } = require('../middlewares/users.middleware');

const {
  protectSession,
  protectUserAccount,
} = require('../middlewares/auth.middleware');

const usersRouter = express.Router();

usersRouter.post('/', createUserValidators, createUser);

usersRouter.post('/login', login);

usersRouter.use(protectSession);

usersRouter.get('/', getAllUsers);

usersRouter
  .use('/:id', userExists)
  .route('/:id')
  .get(getUserById)
  .patch(protectUserAccount, updateUser)
  .delete(protectUserAccount, deleteUser);

module.exports = { usersRouter };
