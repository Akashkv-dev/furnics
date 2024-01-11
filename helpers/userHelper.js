const User=require('../modals/User')
module.exports={
    validUser : async (data)=>{
     var result =await User.findOne({email:data}).lean()
     return result;
    }
}