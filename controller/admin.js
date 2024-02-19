const product = require("../modals/Products");
const multer = require("multer");
const path = require("path");
const orderH = require("../helpers/orderHelper");
const productH = require("../helpers/productHelper");
const userH = require("../helpers/userHelper");
const adminH = require("../helpers/adminHelper")
const nodemailer = require("nodemailer");
const { log } = require("console");
const fs = require('fs');
const { search } = require("../routes");

module.exports = {
  login:(req,res)=>{
    res.render("admin/adminLogin")
  },
  adminSignin:async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const admin = await adminH.findAdmin(email);
    console.log(admin);
    if (admin) {
        if (admin.email === email && admin.password === password) {
          req.session.admin = admin;
          req.session.adminloggedIn = true;
          res.redirect("/admin/dashboard");
        } else {
          res.redirect("/admin/admin");
        }
     
    } else {
      res.redirect("/admin/admin");
    }
  },
  dashboard: (req, res) => {
    res.render("admin/admin");
  },
  addproducts: (req, res) => {
    res.render("admin/addproducts");
  },
  adminlogout: (req, res) => {
    req.session.destroy();
    res.redirect("/");
    console.log("logout");
  },
  productAdded: async function (req, res) {
    console.log(req.body);

    const image = req.body.image;
    // **************get the unique name only*************
    const Image = (req.body.image = path.basename(req.file.filename));

    const data = {
      productname: req.body.productname,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity,
      image: Image,
    };

    await product.insertMany(data);
    res.redirect("/admin/addproducts");
  },

  allorders: async (req, res) => {
    const orders = await orderH.findorder();

    res.render("admin/allorders", { orders });
  },
  filterOrder: async (req, res) => {
    const lowvalue = req.query.l;
    const highvalue = req.query.h;
    const orderfilter = await orderH.filterorder(lowvalue, highvalue);
    res.render('admin/allorders', { orders: orderfilter })
  },
  filterType: async (req, res) => {
    const payType = req.params.paymentMethod;
    console.log(payType);
    const filteredOrderType = await orderH.filterOrderType(payType);
    res.render("admin/allorders", { orders: filteredOrderType });
  }, 
  filterStatus:async(req, res) => {
    const status1 = req.params.status;
    console.log("sjhdhjdshhfj",status1);  

    const filteredOrderStatus = await orderH.filterOrderStatus(status1)
    res.render("admin/allorders", {orders: filteredOrderStatus})
  },
  productdetail: async (req, res) => {
    const id = req.params.id;
    const productid = await orderH.productdetail(id);
    const product = await productH.findingproducts(productid);

    res.render("admin/productdetails", { product });
  },
  confirmorder: async (req, res) => {
    const id = req.params.id;
    const order = await orderH.confirm(id);
    res.redirect("/admin/allorders");
  },
  shiporder: async (req, res) => {
    const id = req.params.id;
    const order = await orderH.shipped(id);
    res.redirect("/admin/allorders");
  },
  deliverorder: async (req, res) => {
    const id = req.params.id;
    const order = await orderH.delivered(id);
    res.redirect("/admin/allorders");
  },
  cancelorder: async (req, res) => {
    const id = req.params.id;
    const order = await orderH.cancelled(id);
    res.redirect("/admin/allorders");
  },
  allusers: async (req, res) => {
    const users = await userH.alluser();
    res.render("admin/allusers", { users:users,search:true });
  },
  // edituser: async (req, res) => {
  //   const userid = req.params.id;
  //   const data = await userH.findedituserbyid(userid);
  //   console.log(data);

  //   res.render("admin/edituser", { data: data });
  // },
  // updateuser: async (req, res) => {
  //   const userid = req.params.id;
  //   const datas = {
  //     name: req.body.name,
  //     email: req.body.email,
  //     password: req.body.password,
  //     phone: req.body.phone,
  //     address: req.body.address,
  //     city: req.body.city,
  //   };
  //   console.log(datas);
  //   await userH.insertupdate(datas, userid);
  //   res.redirect("/admin/allusers");
  // },

  deleteuser: async (req, res) => {
    const userid = req.params.id;

    const result = await userH.findedituserbyid(userid);
    console.log(result);
    const datas = {
      role: result.role,
      name: result.name,
      email: result.email,
      password: result.password,
      phone: result.phone,
    };
    await userH.insertdelete(datas);
    await userH.delete(userid);
    res.redirect("/admin/allusers");
  },
  blockuser: async (req, res) => {
    const productid = req.params.id
    await adminH.blockuser(productid)
    res.redirect('/admin/allusers');
  },
  unblockuser: async (req, res) => {
    const productid = req.params.id
    await adminH.unblockuser(productid)
    res.redirect('/admin/allusers');
  },
  searchuser:async (req,res)=>{
    data=req.body.search
    const user =await userH.searchuser(data)
    console.log(user[0]);
    res.render("admin/allusers",{users:user})
  },
  allproducts: async (req, res) => {
    const data = await productH.allproducts();
    res.render("admin/allproducts", { data: data });
  },
  editproduct: async (req, res) => {
    const productid = req.params.id
    const data = await productH.findItem(productid)
    console.log(data);
    res.render('admin/editproduct', { data })

  },
  updateproduct:async (req,res)=>{
      const productid = req.params.id
      const data = await productH.findItem(productid);
      var image = data.image
      const imagePath = './public/uploads/' + image;
      const Image = (req.body.image = path.basename(req.file.filename));
      fs.unlink(imagePath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.error('Error deleting existing image:', unlinkErr);
        }
      });
      const datas = {
        productname: req.body.productname,
        image: Image,
        price: req.body.price,
        category: req.body.category,
        quantity: req.body.quantity,
      }
      await productH.productupdating(datas, productid)
      res.redirect('/admin/allproducts')
    
  },
  deleteproduct: async (req, res) => {
    const proid = req.params.id
    const data = await productH.findItem(proid);
    const imagePath = './public/uploads/' + data.image;
    fs.unlink(imagePath, (err) => {
      if (err && err.code !== 'ENOENT') {
        console.error('Error deleting existing image:', unlinkErr);
      }
    });
    await productH.deleteproduct(proid)
    res.redirect('/admin/allproducts');
  },
  coupon: async (req, res) => {
    try {
      const coupons = await adminH.findCoupon();
      // const date = new Date();
      res.render("admin/coupon", {coupon:coupons});
    } catch (error) {
      console.log("error while rendering the show coupon page:",error);
      res.render('admin/coupon', { coupons: [] });
    }
  },
  addCoupon:async (req, res) => {
    try {
      // const {couponName,couponCode,amount,startDate,expiryDate} = req.body;
      const coupon = {
        couponName:req.body.couponName,
        couponCode:req.body.couponCode,
        amount:req.body.amount,
        startDate:req.body.startDate,
        expiryDate:req.body.expiryDate
      }
      const existingCoupon = await adminH.findCouponByCode(coupon.couponCode);
      if(existingCoupon){
        res.json({success:false,message:"Coupon already exists!"});
      }
      else{
        await adminH.insertCoupon(coupon);
        res.json({success:true,message:"Coupon added successfully!"});
      }
   } catch (error) {
      console.error('Error while adding coupon:',error);
    }
  }
};
