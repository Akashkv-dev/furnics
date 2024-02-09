const mongoose = require("mongoose");

const Admin = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const admindata = mongoose.model("admins", Admin);
module.exports = admindata;
