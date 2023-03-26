const CryptoJS = require('crypto-js');
const User = require('../models/user');

const registerUser = async (body) => {
  const { name, email, password } = body;

  const register = new User({
    name: name,
    email: email,
    password: CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString(),
  });
  return register;
};

const loginUser = async (body) => {
  const user = await User.findOne({ email: body.email });
  return user;
};

const changePass = async (body, hashPassword) => {
  const updateData = User.findByIdAndUpdate(body._id, {
    $set: { password: hashPassword },
  });
  return updateData;
};

module.exports = { registerUser, loginUser, changePass };
