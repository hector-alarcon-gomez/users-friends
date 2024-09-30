const mongoose = require('mongoose');
const { up, down } = require('./../data/seed');

const MONGODB_URI = process.env.MONGODB_URI;

// flag to reset and seed the db
const resetAndSeedDB = false;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`Connected to db`);

    if (resetAndSeedDB) {
      await down();
      await up();
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
