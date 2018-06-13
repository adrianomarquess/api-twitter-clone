const mongoose = require('mongoose');

const Tweet = mongoose.model('Tweet');

module.exports = {
  async create(req, res, next) {
    try {
      const tweet = await Tweet.create({
        content: req.body.content,
        user: req.userId,
      });

      return res.json(tweet);
    } catch (err) {
      return next();
    }
  },

  async destroy(req, res, next) {
    try {
      const deleted = await Tweet.findByIdAndRemove(req.params.id);

      if (deleted) {
        return res.json({ deleted: true });
      }

      return res.status(404).json({ error: 'Tweet not found' });
    } catch (err) {
      return next();
    }
  },

};
