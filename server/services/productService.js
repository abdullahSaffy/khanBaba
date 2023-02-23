const Product = require('../models/product');
const Category = require('../models/category');
var ObjectId = require('mongoose').Types.ObjectId;

const setProd = async (category) => {
  var categoryData = await Category.findOne({ title: category });
  return categoryData;
};

const searProd = async (page, limit, title) => {
  const data = await Product.find({ title: { $regex: title, $options: 'i' } })
    .populate('category')
    .limit(limit)
    .skip((page - 1) * limit)
    .exec();
  // const countData = await Product.find({ title: { $regex: title, $options: "i" } }).count()
  return data;
};

//all product
const allProducts = async (page, limit) => {
  const data = await Product.find()
    .sort('-createdAt')
    .limit(limit)
    .skip((page - 1) * limit);
  return data;
};

// get product by category

const getProdByCategory = async (id) => {
  const data = await Product.find({ category: id });
  console.log('data: ', data);
  return data;
};

//by code
const slugProdByCode = async (id, _id) => {
  const productsList = await Product.findOne({
    productCode: id,
    category: _id,
  });
  return productsList;
};

module.exports = {
  setProd,
  searProd,
  allProducts,
  getProdByCategory,
  slugProdByCode,
};
