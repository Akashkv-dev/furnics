
const mongoose = require('mongoose')

const deleteA = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    // address:{
    //     type:String
    // },
    phone:{
        type:String
    }
})
 const deleteData=mongoose.model('delete',deleteA) 
 module.exports=deleteData;