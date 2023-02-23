const express = require('express');
const router = express.Router();
const {
  setCategory,
  getCategory,
} = require('../controllers/categoryController');

router.post('/categories', setCategory);
router.post('/categories/:id', getCategory);

module.exports = router;
