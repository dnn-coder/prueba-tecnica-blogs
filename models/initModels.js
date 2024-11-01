const { User } = require('./users.model');
const { Post } = require('./posts.model');
const { Comment } = require('./comments.model');
const { PostImg } = require('./postImg.model');

const initModels = () => {
  //establecer las relacions mediante los modelos

  //1 User M post <--> 1 Post 1 User
  User.hasMany(Post, { foreignKey: 'userId' });
  Post.belongsTo(User);

  //1 Post M imgs <--> 1 img 1 Post
  Post.hasMany(PostImg, { foreignKey: 'postId' });
  PostImg.belongsTo(Post);

  //2 User M comments <--> 1 comment 1 User
  User.hasMany(Comment, { foreignKey: 'userId' });
  Comment.belongsTo(User);

  //3 User M comments <--> 1 comment 1 User
  Post.hasMany(Comment, { foreignKey: 'postId' });
  Comment.belongsTo(Post);
};

module.exports = { initModels };
