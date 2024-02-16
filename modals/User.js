const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "Name should be atleast 4 characters long"],
    maxlength: [20, "Name should be atmost 20 characters long"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    // minlength:[6]
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      price: {
        type: Number,
        required: true,
        // default:0
      },
      
    },
  ],
  couponCode:{
    type: String,
    default:"null",
    required: true,
  },
  coupon:{
    type: String,
    default:"null"
  },
  address: [
    {
      name: {
        type: String,
        required: true,
        
      },
      phone: {
        type: Number,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
      landmark: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
    },
  ],
});

const User = mongoose.model("users", userSchema);
module.exports = User;
