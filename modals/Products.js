const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productname: {
    type: String,
  },
  category: {
    type: String,
  },
  price: {
    type: Number,
  },
  quantity: {
    type: Number,
    default:0
  },
  image: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("products", productSchema);
