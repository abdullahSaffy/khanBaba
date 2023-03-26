const User = require('../models/user');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const {
  registerUser,
  loginUser,
  changePass,
} = require('../services/userService');

// create user
const setUser = async (req, res) => {
  const { name, email, password, verifyPassword } = req.body;

  if (!name || !email || !password || !verifyPassword) {
    return res.send({ status: 'failed', message: 'Please fill the fields' });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: 'User already exist' });

  // check password and verify password
  if (password !== verifyPassword)
    return res.status(400).json({ message: "Password don't match" });

  const newUser = await registerUser(req.body);
  await newUser.save();
  res.status(200).send({ status: 'success', data: newUser });
};

// Get user
const getUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send({
      status: false,
      message: 'Please enter your email and password',
    });
  }

  try {
    const user = await loginUser(req.body);
    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );

    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (OriginalPassword !== password) {
      return res.status(401).json({ msg: 'wrong password credentials' });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SEC,
      {
        expiresIn: '3d',
      }
    );

    res.status(200).send({ ...user._doc, token: accessToken });
  } catch (err) {
    res.status(500).json({ 'err: ': err });
  }
};

const changePassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  if (password && confirmPassword) {
    if (password !== confirmPassword) {
      res.send({
        status: 'failed',
        message: "New Password and Confirm New Password doesn't match",
      });
    } else {
      try {
        const hashPassword = CryptoJS.AES.encrypt(
          password,
          process.env.PASS_SEC
        ).toString();

        const updateData = await changePass(req.user, hashPassword);
        res.send({ status: 'success', data: updateData });
      } catch (err) {
        res.send({ message: err });
      }
    }
  } else {
    res.send({ status: 'failed', message: 'All Fields are Required' });
  }
};

module.exports = { setUser, getUser, changePassword };
