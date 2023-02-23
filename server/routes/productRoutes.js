const express = require('express');
const router = express.Router();

const {
  setProduct,
  searchProduct,
  productList,
  productByCategory,
  slugProduct,
  slugProductByCode,
} = require('../controllers/productController');

router.post('/products', setProduct);
router.post('/searchProd', searchProduct);
router.post('/productsList', productList);
// get category on the basis of category id
router.post('/productsList/:id', productByCategory);
router.post('/products/:slug', slugProduct);
router.post('/products/:slug/:id', slugProductByCode);

module.exports = router;
