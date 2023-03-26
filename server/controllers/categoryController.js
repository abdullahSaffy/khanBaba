const Category = require('../models/category');
const { addCategory, getCategoryById } = require('../services/categoryService');

const setCategory = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(404).send({ message: 'title is required' });
    } else {
      const category = addCategory(title);
      if (!category) {
        return res
          .status(401)
          .send({ message: 'This category has already been added' });
      } else {
        const categories = new Category({
          title,
        });
        const data = await categories.save();
        res.status(201).send({ message: 'Success', data: data });
      }
    }
  } catch (err) {
    res.status(404).send({ err: err });
  }
};

const getCategory = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await getCategoryById(id);
    res.status(200).send({ data });
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = { setCategory, getCategory };
