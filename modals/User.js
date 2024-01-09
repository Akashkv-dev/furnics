const mongoose = require('mongoose')

const userSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true,
        minlength:4
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{

        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    zip:{
        type:Number,
        required:true
    },
    role:{
        type:String,
        default:'user'
    }


})
module.exports=mongoose.model('users',userSchema)