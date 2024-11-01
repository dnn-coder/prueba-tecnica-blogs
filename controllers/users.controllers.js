//libreries
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

//Models
const { User } = require('../models/users.model');
const { Post } = require('../models/posts.model');
const { Comment } = require('../models/comments.model');

//Utils
const { AppError } = require('../utils/appError.util');
const { catchAsync } = require('../utils/catchAsync');
const { Email } = require('../utils/email.util');

//configurations
dotenv.config({ path: './config.env' });

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: ['id', 'name', 'lastName', 'email'],
    include: {
      model: Post,
      attributes: ['id', 'title', 'content', 'userId'],
      include: {
        model: Comment,
        attributes: ['id', 'comment'],
        include: {
          model: User,
          attributes: ['id', 'name', 'lastName', 'email'],
        },
      },
    },
  });

  res.status(200).json({
    status: 'success',
    message: 'users list',
    users,
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const { name, lastName, age, email, password, type } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    lastName,
    age,
    email,
    type,
    password: hashPassword,
  });

  newUser.password = undefined;

  await new Email(email).sendWelcome(name);

  res.status(200).json({
    status: 'success',
    message: 'user created successfully',
    newUser,
  });
});

const getUserById = catchAsync(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({
    status: 'success',
    message: 'find user succesfully',
    user,
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, lastName, age, email, password, type } = req.body;

  await user.update({ name, lastName, age, email, password, type });
  res.status(201).json({
    status: 'success',
    user,
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({ where: { id } });

  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'this user doesnt exist in database',
    });
  }

  await user.update({ status: 'deleted' });

  res.status(200).json({
    status: 'success',
    user,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //validar credenciales (email)
  const user = await User.findOne({ where: { email, status: 'active' } });

  if (!user) {
    return next(new AppError('credentials invalid', 400));
  }

  //validar constraseña
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return next(new AppError('credentials invalid', 400));
  }
  //generar token
  //generar firma segura con node = require('crypto').randomBytes(64).toString('hex')
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
  //response
  res.status(200).json({
    status: 'success',
    token,
  });
});

module.exports = {
  deleteUser,
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  login,
};
