const express = require('express');
const router = express.Router();
const authMidd = require('../middleware/userAuthMidd');
const {
  setUser,
  getUser,
  changePassword,
} = require('../controllers/userController');

//register a user

router.post('/signup', setUser);

//login a user

router.post('/login', getUser);

//changed a user password

router.post('/changePass', authMidd, changePassword);

//reset a password

// router.post("/send-reset-password-email", userController.sendResetMail)

//set password by a link

// router.post("/resets-password/:id/:token", userController.resetPassByMail)

module.exports = router;
