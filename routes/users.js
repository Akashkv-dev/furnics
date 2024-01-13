var express = require('express');
const { loginpage,userAuth,signpage,signUp,logout,allproducts } = require('../controller/user');
const isAuth =require('../middleware/isAuth')

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



module.exports = router;
