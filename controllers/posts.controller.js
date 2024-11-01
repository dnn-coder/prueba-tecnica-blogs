const { Post } = require('../models/posts.model');
const { User } = require('../models/users.model');
const { Comment } = require('../models/comments.model');
const { catchAsync } = require('../utils/catchAsync');
const { Email } = require('../utils/email.util');

const getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.findAll({
    attributes: ['id', 'title', 'content', 'userId'],
    include: [
      { model: User, attributes: ['id', 'name', 'lastName', 'email'] },
      {
        model: Comment,
        attributes: ['id', 'comment'],
        include: {
          model: User,
          attributes: ['id', 'name', 'lastName', 'email'],
        },
      },
    ],
  });
  res.status(200).json({
    ststus: 'success',
    message: 'post list',
    posts,
  });
});

const createPost = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;
  const { sessionUser } = req;

  // const newPost = await Post.create({
  //   title,
  //   content,
  //   userId: sessionUser.id,
  // });

  // await new Email(sessionUser.email).sendNewPost(title, content);

  res.status(201).json({
    status: 'success',
    //newPost,
  });
});

const getPostById = catchAsync(async (req, res, next) => {
  const { post } = req;

  res.status(200).json({
    status: 'success',
    post,
  });
});

const updatePost = catchAsync(async (req, res, next) => {
  const { post } = req;

  await post.update({ title, content });

  res.status(204).json({ status: 'success' });
});

const deletePost = catchAsync(async (req, res, next) => {
  const { post } = req;

  await post.update({ status: 'deleted' });

  res.status(204).json({ status: 'success' });
});

module.exports = {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
};
