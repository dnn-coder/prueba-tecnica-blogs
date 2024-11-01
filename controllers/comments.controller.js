const { Comment } = require('../models/comments.model');
const { Post } = require('../models/posts.model');
const { User } = require('../models/users.model');
const { catchAsync } = require('../utils/catchAsync');

const getAllComments = catchAsync(async (req, res, next) => {
  const comment = await Comment.findAll({
    attributes: ['id', 'comment'],
    include: [
      { model: User, attributes: ['id', 'name', 'lastName', 'email'] },
      {
        model: Post,
        attributes: ['id', 'title', 'content', 'userId'],
        include: {
          model: User,
          attributes: ['id', 'name', 'lastName', 'email'],
        },
      },
    ],
  });
  res.status(200).json({
    ststus: 'success',
    message: 'comments list',
    comment,
  });
});

const createComment = catchAsync(async (req, res, next) => {
  const { postId, comment } = req.body;
  const { sessionUser } = req;

  const newComment = await Comment.create({
    userId: sessionUser.id,
    postId,
    comment,
  });

  res.status(201).json({
    status: 'success',
    newComment,
  });
});

const getCommentById = catchAsync(async (req, res, next) => {
  const { comment } = req;

  res.status(200).json({
    status: 'success',
    comment,
  });
});

const updateComment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { comment } = req.body;

  const comm = await Comment.findOne({ where: { id } });

  await comm.update({ comment });

  res.status(201).json({
    status: 'success',
    comment,
  });
});

const deleteComment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { comment } = req.body;

  const comm = await Comment.findOne({ where: { id } });

  await comm.update({ status: 'deleted' });

  res.status(201).json({
    status: 'success',
    message: 'Comment deleted',
    comment,
  });
});

module.exports = {
  getAllComments,
  createComment,
  getCommentById,
  updateComment,
  deleteComment,
};
