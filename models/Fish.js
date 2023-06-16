const mongoose = require("mongoose");
const { Schema } = mongoose;

const Fish = mongoose.model(
  "Fish",
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      age: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
      },
      weight: {
        type: Number,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
      images: {
        type: Array,
        required: false,
      },
      available: {
        type: Boolean,
      },
      user: Object,
      adopter: Object,
    },
    { timestamps: true }
  )
);

module.exports = Fish;
