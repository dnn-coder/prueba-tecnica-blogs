const express = require('express');
const {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
} = require('../controllers/posts.controller');

//Utils
const { upLoad } = require('../utils/upload.util');

//middlewares
const { protectSession } = require('../middlewares/auth.middleware');

const { postExists } = require('../middlewares/posts.middleware');

const postsRouter = express.Router();

postsRouter.use(protectSession);

postsRouter
  .route('/')
  .get(getAllPosts)
  .post(upLoad.single('postImg'), createPost);

postsRouter
  .use('/id', postExists)
  .route('/:id')
  .get(getPostById)
  .patch(updatePost)
  .delete(deletePost);

module.exports = { postsRouter };
