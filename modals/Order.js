const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    orderid: {
        type: String,
        required: true
    },
    orderdate: {
        type: Date,
        default: () => new Date().toLocaleString('en-US', { timeZone: 'UTC' })
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    landmark: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    cart: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true,
            },

        },
    ],
    status:{
        type:String,
        default:'pending',
        required:true
    },
    totalprice: {
        type: Number,
        required: true,
    },
    paymentid: {
        type: String,
        default: 'null'
      },
    paymentmethod:{
        type:String,
        required:true
    }  

});

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;
