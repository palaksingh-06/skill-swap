const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.log("DB Connection Failed");
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
