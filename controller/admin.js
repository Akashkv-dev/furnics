const product = require('../modals/Products')
const multer = require('multer')
const path = require('path')
const orderH = require('../helpers/orderHelper')
const productH = require('../helpers/productHelper')
const userH = require('../helpers/userHelper')
const nodemailer = require('nodemailer')
module.exports = {



    dashboard: (req, res) => {
        res.render('admin/admin')
    },
    addproducts:
        (req, res) => {
            res.render('admin/addproducts')

        },
    adminlogout: (req, res) => {
        res.redirect('/')
        console.log("logout");
    },
    productAdded: async function (req, res) {



        console.log(req.body);

        const image = req.body.image
        // **************get the unique name only*************
        const Image = req.body.image = path.basename(req.file.filename)

        const data = {

            productname: req.body.productname,
            category: req.body.category,
            price: req.body.price,
            quantity: req.body.quantity,
            image: Image
        }

        await product.insertMany(data)
    },
    // allorders:async (req,res)=>{
    //     const orders =await orderH.findorder()
    //     const Ordid=orders.orderid
    //     console.log(Ordid);

    //     const product =await orderH.populateproduct(Ordid)





    //     res.render('admin/allorders',{orders,product})

    // }
    allorders: async (req, res) => {

        const orders = await orderH.findorder();

        res.render('admin/allorders', { orders });

    },
    productdetail: async (req, res) => {
        const id = req.params.id
        console.log('hfdah', id);
        const productid = await orderH.productdetail(id)
        const product = await productH.findingproducts(productid)

        console.log('sghdgay', product);


        res.render('admin/productdetails', { product })

    },
    confirmorder: async (req, res) => {
        const id = req.params.id
        const order = await orderH.confirm(id)
        res.redirect('/admin/allorders')
    },
    shiporder: async (req, res) => {
        const id = req.params.id
        const order = await orderH.shipped(id)
        res.redirect('/admin/allorders')
    },
    deliverorder: async (req, res) => {
        const id = req.params.id
        const order = await orderH.delivered(id)
        res.redirect('/admin/allorders')
    },
    cancelorder: async (req, res) => {
        const id = req.params.id
        const order = await orderH.cancelled(id)
        res.redirect('/admin/allorders')
    },
    allusers: async (req, res) => {
        const users = await userH.alluser()
        res.render('admin/allusers', { users })
    },
    edituser: async (req, res) => {
        const userid = req.params.id
        const data = await userH.findedituserbyid(userid)
        console.log(data);

        res.render('admin/edituser', { data: data })
    },
    updateuser: async (req, res) => {
        const userid = req.params.id
        const datas = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city
        }
        console.log(datas);
        await userH.insertupdate(datas, userid);
        res.redirect('/admin/allusers')
    },

    deleteuser: async (req, res) => {
        const userid = req.params.id;

        const result = await userH.findedituserbyid(userid)
        console.log(result);
        const datas = {
            role: result.role,
            name: result.name,
            email: result.email,
            password: result.password,
            phone: result.phone,
        }
        await userH.insertdelete(datas)
        await userH.delete(userid)
        res.redirect('/admin/allusers')
    },
    mail: async (email, name) => {
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASS,
          },
        });
        var mailOptions = {
          from: "akashkv11@gmail.com",
          to: email,
          subject: "Welcome " + name,
          text: "Enjoy Your Shopping ",
        };
        transporter.sendMail(mailOptions, function (error, info) {});
    },
    forgotpassword: async (email1, password1) => {
      await User.updateOne({ email: email1 }, { $set: { password: password1 } });
    }




}