const Category = require('../models/category');

const addCategory = async (title) => {
  const category = await Category.findOne({ title });
  return category;
};

const getCategoryById = async (id) => {
  const category = await Category.findOne({ _id: id });
  return category;
};

module.exports = { addCategory, getCategoryById };
