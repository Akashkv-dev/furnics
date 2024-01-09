const product=require('../modals/Products')

module.exports={
    homepage: async (req, res)=> {

      const prodata = await product.find({}).lean()
console.log(prodata);
        res.render('users/index', { prodata })
      }

}