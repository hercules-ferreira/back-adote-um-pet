const mongoose = require("mongoose");

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectou com Mongoose!");
  } catch (error) {
    console.log(error);
  }
}

module.exports = main;
