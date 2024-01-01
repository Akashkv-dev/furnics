var express = require('express');
const { loginpage,signpage } = require('../controller/user');
// const { render } = require('../app');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login',loginpage);
router.get('/signup',signpage);


module.exports = router;
