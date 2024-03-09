const product = require("../modals/Products");

module.exports = {
  prodata:async ()=>{
    const result =await product.find({}).lean().limit(6);
    return result
  },
  allproducts: async (data) => {
    var result = await product.find(data).lean();
    return result;
  },
  findItem: async (data) => {
    var result = await product.findOne({ _id: data }).lean();
    return result;
  },
  findingproducts: async (data) => {
    try {
      const result = await product.find({ _id: { $in: data } }).lean();
      return result;
    } catch (error) {
      // Handle errors
      console.error(error);
      throw error;
    }
  },
  productupdating: async (data, productid) => {
    const result = await product.updateOne({ _id: productid }, {
        $set:
        {
            productname: data.productname,
            image: data.image,
            price: data.price,
            category: data.category,
            quantity: data.quantity,
        }
    },{new:true});
},
deleteproduct:async(data)=>{
  await product.deleteOne({_id : data})
}
};
