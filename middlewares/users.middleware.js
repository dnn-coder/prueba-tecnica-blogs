// Models
const { User } = require('../models/users.model');
const { Post } = require('../models/posts.model');
const { Comment } = require('../models/comments.model');

// Utils
const { AppError } = require('../utils/appError.util');
const { catchAsync } = require('../utils/catchAsync');

const userExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: { id },
    attributes: ['id', 'name', 'lastName', 'email'],
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'content', 'userId'],
        include: {
          model: Comment,
          attributes: ['id', 'comment'],
          include: [
            { model: User, attributes: ['id', 'name', 'lastName', 'email'] },
          ],
        },
      },
    ],
  });

  if (!user) {
    return next(new AppError('This usaer doesnt exist', 404));
  }

  req.user = user;
  next();
});

module.exports = { userExists };
