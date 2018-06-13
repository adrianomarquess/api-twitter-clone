const mongoose = require('mongoose');

const User = mongoose.model('User');
const Tweet = mongoose.model('Tweet');

module.exports = {
  async me(req, res, next) {
    try {
      const user = await User.findById(req.userId);
      const tweetsCount = await Tweet.find({ user: user.id }).count();

      return res.json({
        user,
        tweetsCount,
        followersCount: user.followers.length,
        followingCount: user.following.length,
      });
    } catch (err) {
      return next();
    }
  },

  async feed(req, res, next) {
    try {
      const user = await User.findById(req.userId);

      // const tweets = await Tweet
      //   .find({
      //     user: { $in: [user.id, ...user.following] },
      //   })
      //   .limit(50)
      //   .sort('-createdAt');

      const tweets = await Tweet.aggregate([
        { $match: { user: { $in: [...user.following, mongoose.Types.ObjectId(user.id)] } } },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userTweet',
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ]);

      return res.json(tweets);
    } catch (err) {
      return next();
    }
  },

  async update(req, res, next) {
    try {
      const id = req.userId;

      const {
        name,
        username,
        password,
        confirmPassword,
      } = req.body;


      if (password && password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords does t match' });
      }

      const user = await User.findByIdAndUpdate(id, { name, username }, { new: true });

      if (password) {
        user.password = password;
        await user.save();
      }

      return res.json(user);
    } catch (err) {
      return next();
    }
  },
};
