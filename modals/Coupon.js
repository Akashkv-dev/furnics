const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const couponSchema = new mongoose.Schema({
  couponName: String,
  couponCode: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  startDate:{
    type: String,
    required: true,
  },
  expiryDate:{
    type: String,
    required: true,
  }
})

const Coupon = mongoose.model("coupons", couponSchema);

module.exports = Coupon;
