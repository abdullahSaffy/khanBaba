const Product = require('../models/product');
const Category = require('../models/category');
var ObjectId = require('mongoose').Types.ObjectId;
const {
  setProd,
  searProd,
  allProducts,
  getProdByCategory,
  slugProdByCode,
} = require('../services/productService');
const faker = require('faker');

//set product
const setProduct = async (req, res) => {
  const {
    productCode,
    title,
    imagePath,
    description,
    price,
    category,
    manufacturer,
    available,
  } = req.body;
  var productCode1 = faker.helpers.replaceSymbolWithNumber('bob????##???', '?');
  var title1 = faker.name.title();
  var imagePath1 = faker.image.image(200);
  var description1 = faker.lorem.sentences();
  var price1 = faker.random.number({ min: 10 });
  var manufacturer1 = faker.lorem.paragraph(3);

  try {
    if (category) {
      const categoryData = await setProd(category);
      // var categoryData = await Category.findOne({ title: category });

      if (categoryData) {
        var id = categoryData._id;
        // console.log('id: ', id);
      } else {
        return res
          .status(403)
          .send({ message: 'This category is not available' });
      }

      const productData = await Product.findOne({ productCode });
      if (productData) {
        return res
          .status(403)
          .send({ message: 'this product is already addes' });
      } else {
        const product = new Product({
          productCode: productCode ? productCode : productCode1,
          title: title ? title : title1,
          imagePath: imagePath ? imagePath : imagePath1,
          description: description ? description : description1,
          price: price ? price : price1,
          category: id,
          manufacturer: manufacturer ? manufacturer : manufacturer1,
          available: true,
        });
        const data = await product.save();
        // console.log('data:', data);
        return res
          .status(200)
          .send({ message: 'data added successfully', data: data });
      }
    } else {
      res.status(403).send({ message: 'Please add a category' });
    }
  } catch (err) {
    res.status(403).send({ err: err });
  }
};

// search product
const searchProduct = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const { title } = req.body;
  if (title) {
    const data = await searProd(page, limit, title);
    // console.log('title: ', title);
    // console.log('data: ', data);
    // const count = await prodService.searProd(title);
    const count = await Product.find({
      title: { $regex: title, $options: 'i' },
    }).count();
    // console.log(count);
    if (data) {
      res.status(202).send({ success: true, data: data, count: count });
    } else {
      res
        .status(404)
        .send({ success: false, message: 'this title is not available' });
    }
  } else {
    res.status(401).send({ success: false, msg: 'add a title' });
  }
};

//all product list
const productList = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 16;
  //   console.log('all product');
  try {
    const data = await allProducts(page, limit);
    const total = await Product.find().count();
    res.status(200).send({ data: data, total: total, page: page });
  } catch (err) {
    // console.log('error:', err);
    res.status(400).send(err);
  }
};

//all product list on the basis of category id
const productByCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getProdByCategory(id);
    res.status(200).send({ data: data });
  } catch (err) {
    // console.log('error:', err);
    res.status(400).send(err);
  }
};

//slug product
const slugProduct = async (req, res) => {
  const { slug } = req.params;
  const page = req.query.page || 1;
  const limit = req.query.limit || 3;

  if (!slug) {
    res.status(403).send({ success: false, msg: 'add a slug' });
  } else {
    try {
      const category = await Category.findOne({ slug: 'backpacks' });
      // const id = _id.toString();

      const productsList = await Product.find({
        category: new ObjectId(category._id),
      })
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('category');

      const count = await Product.count({
        category: new ObjectId(category._id),
      });

      // console.log('productsList:', productsList)
      res.status(202).send({ success: true, data: productsList, total: count });
    } catch (err) {
      console.log(err);
      res.status(400).send({ success: false });
    }
  }
};

// slug product by code

const slugProductByCode = async (req, res) => {
  const { slug, id } = req.params;
  const { _id } = await Category.findOne({ slug: 'backpacks' });
  if (_id) {
    if (!slug && !id) {
      res.status(403).send({ success: false, msg: 'add a slug and id' });
    } else {
      try {
        // const productsList = await Product.findOne({ productCode: id, category: _id })
        const productsList = await slugProdByCode(id, _id);
        // console.log('productsList: ', productsList);
        res.status(202).send({ success: true, data: productsList });
      } catch (err) {
        res.status(202).send({ success: false, message: err });
      }
    }
  } else {
    res
      .status(202)
      .send({ success: false, message: 'this product code not exist' });
  }
};

module.exports = {
  setProduct,
  searchProduct,
  productList,
  productByCategory,
  slugProduct,
  slugProductByCode,
};
