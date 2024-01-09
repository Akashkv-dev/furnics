var express = require('express');
const { loginpage,signpage,signUp } = require('../controller/user');
// const { render } = require('../app');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login',loginpage);
router.get('/signup',signpage);
router.post('/signedIn',signUp)


module.exports = router;
