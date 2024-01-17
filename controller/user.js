
const adminkey = process.env.ADMINKEY
const adminpw = process.env.ADMINPW
const bcrypt = require('bcrypt')

const userH = require('../helpers/userHelper')
const productH = require('../helpers/productHelper')
const { request } = require('express')

module.exports = {
    loginpage: (req, res) => {
        if(req.session.loggedIn){
            res.redirect('/')
        }
        else{
            res.render('users/login')
        }
        
    },
    userAuth: async (req, res) => {

        const valid = await userH.validUser(req.body.email)

        const currentPassword = await bcrypt.compare(req.body.password, valid.password)
        console.log(currentPassword);


        if (!valid) {
            res.render('users/login', { invalid: "invalid email" })
        }
        else {
            console.log(req.body);
            console.log(adminkey, adminpw);
            if (adminkey == req.body.email && adminpw == req.body.password) {
                res.redirect('/admin/dashboard')
                console.log(req.body.email);
            }
            else if (currentPassword) {

                req.session.userId = valid._id
                req.session.loggedIn = true
                console.log("User logged in");
                res.redirect('/')

            }
            else {

                res.render('users/login', { invalid: "invalid password" })
            }

        }
    },
    
    signpage: (req, res) => {
        res.render('users/signup')
    },
    signUp: async function (req, res) {
        try {
            console.log(req.body);
            const details = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                phone: req.body.phone,
            }
            const hashpassword = await bcrypt.hash(req.body.password, 10)
            details.password = hashpassword
            await userH.insertData(details)
            res.redirect('/login')

        } catch (error) {
            console.log('existing user', error);
            res.render('users/signup', { invalid: "existing user" })

        }

    },
    logout: (req, res) => {
        req.session.destroy()
        res.redirect('/')
    },
    allproducts: async (req, res) => {
        console.log("id-" + req.session.userId);

        const prodata = await productH.allproducts()
        const isUser = req.session.loggedIn
        res.render('users/allproducts', { prodata, isUser })
    },
    viewcart: async (req, res) => {
        try {
            userid = req.session.userId
            console.log(userid);

        const cartProduct = await userH.findProduct(userid)

        res.render('users/cart', { cartItem:cartProduct.cart})
         
            
        } catch (error) {
            console.error('product not found',error);
            
        }
        
    },
    addTocart: async (req, res) => {
        const Productid = req.params.id
        const userid = req.session.userId


        try {
            // const selectedItem=await productH.findItem(productid)
            const arrayItems = {
                productid: Productid,
                quantity: 1
            }
            await userH.pushTOcart(arrayItems, userid)

            res.redirect('/users/cart')


        } catch (error) {
            console.error(error)
            res.status(500).send('Internal Server Error');
        }
    }

} 