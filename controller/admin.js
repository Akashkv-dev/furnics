const product= require('../modals/Products')
const multer = require('multer')
const adminkey = process.env.ADMINKEY
const adminpw = process.env.ADMINPW
const path = require('path')
module.exports = {

    adminAuth: (req, res) => {
        if (adminkey == req.body.email) {
            if (adminpw == req.body.password) {

                res.redirect('/admin/dashboard')
                console.log(req.body.email);

            }
            else {

                res.redirect('/users/login')

            }
        }
        else {
            res.redirect('/users/login')

        }
    },


    dashboard:(req,res)=>{
        res.render('admin/admin')
    },
    addproducts:
        (req,res)=>{
            res.render('admin/addproducts')
        
    },
    adminlogout:(req,res)=>{
        res.redirect('/')
        console.log("logout");
    },


    
    productAdded: async function(req,res){

        

        console.log(req.body);

        const image=req.body.image
        // **************get the unique name only*************
        const Image=req.body.image=path.basename(req.file.filename)

        const data={

            productname:req.body.productname,
            category:req.body.category,
            price:req.body.price,
            quantity:req.body.quantity,
            image:Image
        }

        await product.insertMany(data)
    }
}