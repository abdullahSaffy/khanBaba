const Cart = require('../models/cart');
const Product = require('../models/product');

// GET: add a product to the shopping cart when "Add to cart" button is pressed
const addToCart = async (req, res) => {
  const productId = req.params.id;

  try {
    let user_cart;
    if (req.user) {
      user_cart = await Cart.findOne({ user: req.user._id });
    }
    let cart;
    if (!req.user && req.session.cart) {
      cart = await new Cart(req.session.cart);
      // console.log('cart: ', cart);
    } else if (!user_cart) {
      cart = new Cart({});
      // console.log('cart: ', cart);
    } else {
      cart = user_cart;
    }

    const product = await Product.findById(productId);
    const itemIndex = cart.items.findIndex((p) => p.productId == productId);
    // console.log('itemIndex: ', itemIndex);
    if (itemIndex > -1) {
      // if product exists in the cart, update the quantity
      cart.items[itemIndex].qty++;
      cart.items[itemIndex].price = cart.items[itemIndex].qty * product.price;
      cart.totalQty++;
      cart.totalCost += +product.price;
    } else {
      // if product does not exists in cart, find it in the db to retrieve its price and add new item

      // const cartData = await Cart.findById(productId)
      //   .populate('productId') // key to populate
      //   .then((user) => {
      //     res.json(user);
      //   });
      // console.log('cartData', cartData);
      cart.items.push({
        productId: productId,
        productImage: product.imagePath,
        qty: 1,
        price: product.price,
        title: product.title,
        productCode: product.productCode,
      });
      cart.totalQty++;
      cart.totalCost += +product.price;
    }
    if (req.user) {
      cart.user = req.user._id;
      await cart.save();
    }
    req.session.cart = cart;
    res.send({ message: 'success', cart: cart });
  } catch (err) {
    res.send({ message: 'product is not added successfully' });
  }
};

// reduce the cart count
const reduceCart = async (req, res) => {
  const prodId = req.params.id;
  try {
    let user_cart;
    if (req.user) {
      user_cart = await Cart.findOne({ user: req.user._id });
    }
    let indexNo = user_cart.items.findIndex((p) => p.productId == prodId);

    if (indexNo > -1) {
      const product = await Product.findById(prodId);
      user_cart.items.filter((item) => item.qty != 0);

      user_cart.items.remove({
        _id: user_cart.items[indexNo]._id,
      });

      user_cart.totalQty = 0;
      user_cart.totalCost = 0;

      if (user_cart.items.length > 0) {
        user_cart.items.forEach((item) => {
          user_cart.totalQty = user_cart.totalQty + item.qty;
          user_cart.totalCost = user_cart.totalCost + item.price * item.qty;
        });
      }

      // if (user_cart.items[indexNo].qty <= 0) {
      //   console.log('all remove')
      //   await user_cart.items.remove({
      //     _id: user_cart.items[indexNo]._id,
      //   });
      // }
      // switch(user_cart){
      //   case user_cart.totalQty <= 0:
      //     return  await Cart.findByIdAndRemove(user_cart._id)
      // }

      if (user_cart.totalQty <= 0) {
        await Cart.findByIdAndRemove(user_cart._id);
      }

      if (user_cart.items.length > 0) {
        res.status(200).send({
          cart: user_cart,
          message: 'product is successfully deleted',
        });
      } else {
        return res.status(200).send({
          cart: [],
          message: 'product is deleted,card is empty',
        });
      }
    } else {
      res.status(400).send({ message: 'product is not available' });
    }

    if (req.user) {
      await user_cart.save();
    }
  } catch (err) {
    res.status(400).send({ success: false, err: err });
  }
};

//show all session
const shoppingCart = async (req, res) => {
  if (!req.user) {
    return res.status(400).send({ message: 'Please login first' });
  }

  try {
    let user_cart;
    if (req.user) {
      user_cart = await Cart.findOne({ user: req.user._id });
      const items = user_cart.items;
      res.status(200).send({ items: items });
    } else {
      res.status(400).send({ message: 'there is no shopping exist' });
    }
  } catch (err) {
    console.log('error', err);
  }
};

// remove all cart
const removeAllCart = async (req, res) => {
  const id = req.params.id;
  try {
    let user_cart;
    if (req.user) {
      user_cart = await Cart.findOne({ user: req.user._id });
    }

    let itemIndex = user_cart.items.findIndex((p) => p.productId == id);
    if (itemIndex > -1) {
      user_cart.totalQty = 0;
      user_cart.totalCost = 0;
      user_cart.items.splice(itemIndex, 1);
    }

    if (req.user) {
      await user_cart.save();
    }
    res.status(200).send({ message: 'carts is successfully removeAll' });
  } catch (err) {
    console.log('error', err);
  }
};

module.exports = { addToCart, reduceCart, shoppingCart, removeAllCart };
