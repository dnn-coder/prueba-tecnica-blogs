const path = require('path');

//models
const { Post } = require('../models/posts.model');
const { catchAsync } = require('../utils/catchAsync');

const renderIndex = catchAsync(async (req, res, next) => {
  const posts = await Post.findAll();

  res.status(200).render('index', {
    title: 'renderizado con pug',
    posts,
  });

  // const indexPath = path.join(__dirname, '..', 'public', 'index.pug');

  // res.status(200).render(indexPath);
});

module.exports = { renderIndex };
