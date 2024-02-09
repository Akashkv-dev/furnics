const product = require("../modals/Products");
const multer = require("multer");
const path = require("path");
const orderH = require("../helpers/orderHelper");
const productH = require("../helpers/productHelper");
const userH = require("../helpers/userHelper");
const adminH = require("../helpers/adminHelper")
const nodemailer = require("nodemailer");
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
    res.render("admin/allusers", { users });
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
  allproducts: async (req, res) => {
    const data = await productH.allproducts();
    res.render("admin/allproducts", { data: data });
  },
};
