const user=require('../modals/User')
module.exports={
    validUser : async (data)=>{
     var result =await user.findOne({email:data}).lean()
     return result;
    }
}