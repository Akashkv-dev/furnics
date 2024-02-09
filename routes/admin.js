const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer.js");
const adminAuth = require("../middleware/adminAuth.js")
const {
  login,
  dashboard,
  addproducts,
  adminlogout,
  productAdded,
  allorders,
  productdetail,
  confirmorder,
  shiporder,
  deliverorder,
  cancelorder,
  allusers,
  //edituser,
  //updateuser,
  deleteuser,
  allproducts,
  adminSignin
} = require("../controller/admin.js");

router.get("/admin",login)
router.post("/signin",adminSignin)
router.get("/dashboard",adminAuth, dashboard);
router.get("/logout", adminlogout);
router.get("/addproducts",adminAuth, addproducts);
router.post("/productadded",adminAuth, upload.single("image"), productAdded);
router.get("/allorders",adminAuth, allorders);
router.get("/product/:id",adminAuth, productdetail);
router.get("/confirm/:id",adminAuth, confirmorder);
router.get("/shipped/:id",adminAuth, shiporder);
router.get("/delivered/:id",adminAuth, deliverorder);
router.get("/cancelled/:id",adminAuth, cancelorder);
router.get("/allusers",adminAuth, allusers);
// router.get("/edituser/:id", edituser);
// router.post("/updateuser/:id", updateuser);
router.get("/deleteuser/:id",adminAuth, deleteuser);
router.get("/allproducts",adminAuth, allproducts);

module.exports = router;
