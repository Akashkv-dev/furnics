const product=require('../modals/Products')

module.exports={
    homepage: async (req, res)=> {


      const prodata = await product.find({}).lean()
console.log(prodata);
      const isUser =req.session.loggedIn
      console.log(isUser);
        res.render('users/index', { prodata,isUser })
      }

}