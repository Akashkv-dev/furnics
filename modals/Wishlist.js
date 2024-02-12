const mongoose = require("mongoose")

const wishlistSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"products",
        required:true
    }]
})

const Wishlist = mongoose.model("wishlist",wishlistSchema)
module.exports = Wishlist