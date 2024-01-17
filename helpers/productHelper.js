const product =require('../modals/Products')

module.exports={
    allproducts:async (data)=>{
        var result =await product.find(data).lean()
        return result;

    },
    findItem:async (data)=>{
        var result =await product.findOne({_id:data}).lean()
        return result;
    }
    
}