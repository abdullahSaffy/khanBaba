const express = require('express');
const router = express.Router();
const authMidd = require('../middleware/userAuthMidd');

const {
  addToCart,
  reduceCart,
  shoppingCart,
  removeAllCart,
} = require('../controllers/cartController');

router.post('/add-to-cart/:id', authMidd, addToCart);
router.post('/reduce/:id', authMidd, reduceCart);
router.post('/shopping-cart', authMidd, shoppingCart);
router.post('/removeAll/:id', authMidd, removeAllCart);

module.exports = router;
