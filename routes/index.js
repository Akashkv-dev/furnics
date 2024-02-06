var express = require("express");
var router = express.Router();
const { homepage } = require("../controller/index");

/* GET home page. */
router.get("/", homepage);

module.exports = router;
