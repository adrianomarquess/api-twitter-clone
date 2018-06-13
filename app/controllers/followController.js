const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = {
  async follow(req, res, next) {
    try {
      const userFollow = await User.findById(req.params.id);

      if (!userFollow) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (userFollow.followers.indexOf(req.userId) !== -1) {
        return res.status(400).json({ error: `Você já está seguindo ${userFollow.username}` });
      }

      userFollow.followers.push(req.userId);
      await userFollow.save();

      const userLogged = await User.findById(req.userId);
      userLogged.following.push(userFollow.id);
      await userLogged.save();

      return res.json(userLogged);
    } catch (err) {
      return next(err);
    }
  },

  async unfollow(req, res, next) {
    try {
      const userUnfollow = await User.findById(req.params.id);

      if (!userUnfollow) {
        return res.status(404).json({ error: 'User not found' });
      }

      const seguindo = userUnfollow.followers.indexOf(req.userId);
      if (seguindo === -1) {
        return res.status(400).json({ error: `Você não está seguindo ${userUnfollow.username}` });
      }

      userUnfollow.followers.splice(seguindo, 1);
      await userUnfollow.save();

      const userLogged = await User.findById(req.userId);

      const posicaoUnfollow = userLogged.following.indexOf(userUnfollow.id);
      userLogged.following.splice(posicaoUnfollow, 1);

      await userLogged.save();

      return res.json(userLogged);
    } catch (err) {
      return next(err);
    }
  },
};
