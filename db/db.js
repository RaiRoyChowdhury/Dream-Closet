const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://Rai:Dt0dkBmY0QB2AQHm@cluster0.qmprrym.mongodb.net/wardrobe_optimizer"
  );

  console.log("MongoDB Connected");
};

module.exports = connectDB;