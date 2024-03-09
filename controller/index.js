const productH = require("../helpers/productHelper");
const userH =require("../helpers/userHelper")
const adminH=require("../helpers/adminHelper")

module.exports = {
  homepage: async (req, res) => {
    const prodata = await productH.prodata()
    const banner = await adminH.allbanners()
    // console.log(prodata);
    const isUser = req.session.loggedIn;
    // console.log(isUser);
    const userid =req.session.userId
    const user =await userH.findProduct(userid)
    if(user && user.cart && user.cart.cart){
      const cartItems = user.cart.cart
      const cartcount =cartItems.length
      res.render("users/index", { prodata,banner, isUser,cartcount });
    } 
    else{
      if(req.session.cart){
        const cartcount = req.session.cart.length
      res.render("users/index", { prodata,banner,cartcount});
      }
      else{
      res.render("users/index", { prodata,banner,cartcount:0});
      }

    }
  },
};
