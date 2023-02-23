const jwt = require('jsonwebtoken');
const User = require('../models/user');
const moment = require('moment');

var checkUserAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      // Get Token from header
      token = authorization.split(' ')[1];
      // Verify Token
      const decode = await jwt.verify(token, process.env.JWT_SEC);

      const iat = decode.iat;
      var userId = decode.id;
      // Get User from Token
      req.user = await User.findById(decode.id).select('-password');
      const unix = moment.unix(iat);
      const iatDate = new Date(unix);
      const iatTime = iatDate.getTime();

      const createDate = new Date(req.user.updatedAt);
      const createTime = createDate.getTime();
      if (createTime > iatTime) {
        return res.status(403).send({ message: 'sorry, token is expire' });
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(401).send({ status: 'failed', message: 'Unauthorized User' });
    }
  }
  if (!token) {
    res
      .status(401)
      .send({ status: 'failed', message: 'Unauthorized User, No Token' });
  }
};

module.exports = checkUserAuth;
