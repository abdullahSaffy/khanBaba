const mongoose = require('mongoose');

const connectDB = async () => {
  const connection =
    process.env.MONGODB_URL ||
    // 'mongodb+srv://ecommerce-api:ecommerce-api@cluster0.p1msm.mongodb.net/khanbaba?retryWrites=true&w=majority';
    'mongodb://ecommerce-api:ecommerce-api@cluster0-shard-00-00.p1msm.mongodb.net:27017,cluster0-shard-00-01.p1msm.mongodb.net:27017,cluster0-shard-00-02.p1msm.mongodb.net:27017/khanbaba?ssl=true&replicaSet=atlas-owclde-shard-0&authSource=admin&retryWrites=true&w=majority';
  try {
    await mongoose
      .connect(connection)
      .then(() => {
        console.log('Connected to mongodb successfully');
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
