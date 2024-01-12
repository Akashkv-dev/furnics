const User=require('../modals/User')
module.exports={
    validUser : async (data)=>{
     var result =await User.findOne({email:data}).lean().limit(6)
     return result;
    },
    insertData : async (data)=>{
        var result = await User.insertMany(data)
        return result;
    }
}