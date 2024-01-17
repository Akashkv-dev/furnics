const product= require('../modals/Products')
const multer = require('multer')
const path = require('path')
module.exports = {



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