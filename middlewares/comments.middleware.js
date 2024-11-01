// Models
const { User } = require('../models/users.model');
const { Post } = require('../models/posts.model');
const { Comment } = require('../models/comments.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError.util');

const commentExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const comment = await Comment.findOne({
    where: { id },
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

  if (!comment) {
    return next(new AppError('This comment doesnt exist', 404));
  }

  req.comment = comment;
  next();
});

module.exports = { commentExists };
