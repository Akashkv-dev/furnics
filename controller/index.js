const product = require("../modals/Products");
const userH =require("../helpers/userHelper")

module.exports = {
  homepage: async (req, res) => {
    const prodata = await product.find({}).lean().limit(6);
    // console.log(prodata);
    const isUser = req.session.loggedIn;
    // console.log(isUser);
    const userid =req.session.userId
    const user =await userH.findProduct(userid)
    if(user && user.cart && user.cart.cart){
      const cartItems = user.cart.cart
      const cartcount =cartItems.length
      res.render("users/index", { prodata, isUser,cartcount });
    }
    else{
      res.render("users/index", { prodata,cartcount:0 });

    }
  },
};
