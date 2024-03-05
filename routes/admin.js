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
  adminSignin,
  coupon,
  addCoupon,
  blockuser,
  unblockuser,
  editproduct,
  updateproduct,
  deleteproduct,
  searchuser,
  // filterType,
  filterOrders
  // filterStatus
} = require("../controller/admin.js");
const admin = require("../controller/admin.js");

router.get("/admin",login)
router.post("/signin",adminSignin)
router.get("/dashboard",adminAuth, dashboard);
router.get("/logout", adminlogout);
router.get("/addproducts",adminAuth, addproducts);
router.post("/productadded",adminAuth, upload.single("image"), productAdded);
router.get("/allorders",adminAuth, allorders);
router.get("/filter", adminAuth, filterOrders);
// router.get("/filter/:paymentMethod", adminAuth, filterType);
// router.get("/filterstatus/:status",adminAuth, filterStatus)
router.get("/product/:id",adminAuth, productdetail);
router.get("/confirm/:id",adminAuth, confirmorder);
router.get("/shipped/:id",adminAuth, shiporder);
router.get("/delivered/:id",adminAuth, deliverorder);
router.get("/cancelled/:id",adminAuth, cancelorder);
router.get("/allusers",adminAuth, allusers);
router.post("/search",adminAuth,searchuser)
// router.get("/edituser/:id", edituser);
// router.post("/updateuser/:id", updateuser);
router.get("/deleteuser/:id",adminAuth, deleteuser);
router.get("/blockuser/:id",adminAuth, blockuser);
router.get("/unblockuser/:id",adminAuth, unblockuser);
router.get("/allproducts",adminAuth, allproducts);
router.get("/editproduct/:id",adminAuth, editproduct);
router.post("/editproduct/:id",adminAuth, upload.single("image"), updateproduct);
router.get("/deleteproduct/:id",adminAuth,deleteproduct)

//coupon
router.get("/coupon",adminAuth, coupon);
router.post("/addcoupon",adminAuth, addCoupon);

module.exports = router;
