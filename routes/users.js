var express = require('express');
const { loginpage,userAuth,signpage,signUp,logout,allproducts,viewcart,addTocart } = require('../controller/user');
const isAuth =require('../middleware/isAuth')
const noCache=require('../middleware/noCache');

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
router.get('/addproducts',isAuth,allproducts);
router.get('/cart',isAuth,viewcart)
router.get('/addtocart/:id',isAuth,addTocart)




module.exports = router;
