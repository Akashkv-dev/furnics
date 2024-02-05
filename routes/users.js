var express = require('express');
const { loginpage,userAuth,signpage,signUp,logout,allproducts,viewcart,addTocart,quantityUpdate,cartItemRemove,productpage,edituser, updateuser,
forgotpassword,sendotp,resetpassword } = require('../controller/user');
const { checkOut,postCheckout,verifyPayment,success,findorders } = require('../controller/order');
const isAuth =require('../middleware/isAuth');
// const noCache=require('../middleware/noCache');

// const { render } = require('../app');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login',loginpage);
router.post('/signin',userAuth)
router.get('/signup',signpage);
router.post('/signedIn',signUp)
router.get('/logout',logout)
router.get('/forgotpassword',forgotpassword)
router.post('/sendotp',sendotp)
router.post('/resetpassword',resetpassword)


router.get('/profile',isAuth,edituser);
router.post('/updateuser/:id',isAuth,updateuser)
router.get('/addproducts',isAuth,allproducts);
router.get('/cart',isAuth,viewcart)
router.get('/addtocart/:id',isAuth,addTocart)
router.post('/cart/update',isAuth,quantityUpdate)
router.post('/cart/remove',isAuth,cartItemRemove)
router.get('/checkout',isAuth,checkOut)
router.post('/postcheckout',isAuth,postCheckout)
router.post('/verifypayment',isAuth,verifyPayment)
router.get('/success',success)
router.get('/productview/:id',isAuth,productpage)
router.get('/myorders',isAuth,findorders)



module.exports = router;
