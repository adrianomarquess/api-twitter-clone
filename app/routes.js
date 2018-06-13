const express = require('express');
const requireDir = require('require-dir');

const routes = express.Router();

const authMiddleware = require('./middlewares/auth');

const controllers = requireDir('./controllers');

// Auth
routes.post('/signup', controllers.authController.signup);
routes.post('/signin', controllers.authController.signin);

// Auth routes
routes.use(authMiddleware);

// Users
routes.get('/users/me', controllers.userController.me);
routes.put('/users', controllers.userController.update);
routes.get('/feed', controllers.userController.feed);

// Follow
routes.post('/follow/:id', controllers.followController.follow);
routes.delete('/unfollow/:id', controllers.followController.unfollow);

// Tweets
routes.post('/tweets', controllers.tweetController.create);
routes.delete('/tweets/:id', controllers.tweetController.destroy);

// Like
routes.post('/like/:id', controllers.likeController.toggle);

module.exports = routes;
