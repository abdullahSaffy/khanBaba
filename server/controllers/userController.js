const User = require('../models/user');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const {
  registerUser,
  loginUser,
  changePass,
} = require('../services/userService');

const setUser = async (req, res) => {
  //   console.log('req.body: ', req.body);
  const { name, email, password, verifyPassword } = req.body;

  if (!name || !email || !password || !verifyPassword) {
    return res.send({ status: 'failed', message: 'Please fill the fields' });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.send({ status: 'failed', message: 'Email already exists' });
  }

  // check password and verify password
  if (password === verifyPassword) {
    try {
      const user = await registerUser(req.body);
      await user.save();
      res.status(201).send({ status: 'success', data: user });
    } catch (error) {
      //   console.log(error);
      res.send({ status: 'failed', message: 'Unable to Register' });
    }
  } else {
    res.send({
      status: 'failed',
      message: "Password and Confirm Password doesn't match",
    });
  }
};

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
    if (!user) {
      return res.status(401).json({ msg: 'wrong credentials' });
    }
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

    // console.log('user._doc: ', user);

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

        // console.log("hashPassword: ", req.user);

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
