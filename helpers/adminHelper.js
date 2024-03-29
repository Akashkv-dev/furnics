const product=require('../modals/Products')
const Admin = require("../modals/Admin")
const Coupon = require("../modals/Coupon")
const User = require("../modals/User")
const Banner = require("../modals/Banner")

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
    blockuser: async (data) => {
        await User.updateOne({ _id: data }, { $set: { status: "block" } });
      },
      unblockuser: async (data) => {
        await User.updateOne({ _id: data }, { $unset: { status: 1 } });
    },
    insertBanner:async (data)=>{
        await Banner.insertMany(data)
    },
    allbanners:async ()=>{
        const result = await Banner.find().lean()
        return result
    }
    
}