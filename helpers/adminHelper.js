const product=require('../modals/Products')
const Admin = require("../modals/Admin")
const Coupon = require("../modals/Coupon")

module.exports ={
    findAdmin:async (email)=>{
        const result =await Admin.findOne({email:email})
        return result
    },
    findCoupon:async ()=>{
        const result =await Coupon.find().lean()
        return result
    },
    findCouponByCode:async (code)=>{
        const result =await Coupon.findOne({couponCode:code}).lean()
        return result
    },
    insertCoupon:async (data)=>{
        const result =await Coupon.insertMany(data)
        return result
    },
    
}