const product=require('../modals/Products')
const Admin = require("../modals/Admin")

module.exports ={
    findAdmin:async (email)=>{
        const result =await Admin.findOne({email:email})
        return result
    }
    
}