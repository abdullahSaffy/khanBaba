require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/db.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');

const PORT = process.env.PORT || 4000;
db();

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

//session

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        // 'mongodb+srv://ecommerce-api:ecommerce-api@cluster0.p1msm.mongodb.net/khanbaba?retryWrites=true&w=majority',
        'mongodb://ecommerce-api:ecommerce-api@cluster0-shard-00-00.p1msm.mongodb.net:27017,cluster0-shard-00-01.p1msm.mongodb.net:27017,cluster0-shard-00-02.p1msm.mongodb.net:27017/khanbaba?ssl=true&replicaSet=atlas-owclde-shard-0&authSource=admin&retryWrites=true&w=majority',
      ttl: { maxAge: 60 * 1000 * 60 * 3 },
    }),
    //session expires after 3 hours
    cookie: { maxAge: 60 * 1000 * 60 * 3 },
  })
);

//user route
app.use('/api', userRoutes);

// categories route
app.use('/api', categoryRoutes);

//product routes
app.use('/api', productRoutes);

// add to cart routes
app.use('/api', cartRoutes);

// checkout route
app.use('/api', checkoutRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
