const product =require('../modals/Products')

module.exports={
    allproducts:async (data)=>{
        var result =await product.find(data).lean()
        return result;

    }
}