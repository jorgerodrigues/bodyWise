const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    // searches for the user based on the id derived from the token (token consists of id, signature and time)
    const user = await User.findOne({
      _id: verified._id,
      'tokens.token': token,
    });

    if (!user) {
      console.log('User not found');
      throw new Error('User not found');
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: e.message });
  }
};

module.exports = auth;
