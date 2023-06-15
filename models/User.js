const mongoose = require("../db/conn");
const { Schema } = mongoose;

const User = mongoose.model(
  "User",
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      image: {
        type: String,
      },
      phone: {
        type: String,
      },
      // esse role ==> é o papel= função da pessoa, o enum, garante que so receberá uma das opções no array
      role: {
        type: String,
        enum: ["cliente", "colaborador", "admin"],
        lowercase: true,
      },
    },
    { timestamps: true }
  )
);

module.exports = User;
