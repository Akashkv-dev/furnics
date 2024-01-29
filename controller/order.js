const orderH= require('../helpers/orderHelper');
const userH = require('../helpers/userHelper');

module.exports={
    checkOut:async (req,res)=>{
        const userid = req.session.userId
        const cartProduct = await userH.findProduct(userid)
        let totalPay=0
         if(cartProduct){
            if(cartProduct.totalPrice==0){
                totalPay=0
            }
            else{
                totalPay=cartProduct.totalPrice+5
            }
            res.render('users/checkout',{cart:cartProduct.cart.cart,totalPrice:cartProduct.totalPrice,totalPay})
        }
        else{
            res.redirect('/users/cart')
            console.log('cartData not found');
        }
        },
    postCheckout:async (req,res)=>{

        try {
            const userid = req.session.userId;
            const user = await userH.findProduct(userid);
            const cart = user.cart.cart;
            console.log(req.body);
            if(user){
                await orderH.addAddress(req.body,userid)
                res.redirect('/users/checkout')
            }

            
        } catch (error) {
            
        }

    }
}
