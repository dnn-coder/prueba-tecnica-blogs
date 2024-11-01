// Models
const { Post } = require('../models/posts.model');
const { User } = require('../models/users.model');
const { Comment } = require('../models/comments.model');

// Utils
const { AppError } = require('../utils/appError.util');
const { catchAsync } = require('../utils/catchAsync');

const postExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findOne({
    where: { id },
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

  if (!post) {
    return next(new AppError('This post doesnt exist', 404));
  }

  req.post = post;
  next();
});

module.exports = { postExists };
