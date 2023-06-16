const mongoose = require("mongoose");

async function main() {
  try {
    await mongoose.connect("mongodb://localhost:27017/getapetref");
    console.log("Conectou com Mongoose!");
  } catch (error) {
    console.log(error);
  }
}

module.exports = main;
