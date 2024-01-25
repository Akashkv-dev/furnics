
const adminkey = process.env.ADMINKEY
const adminpw = process.env.ADMINPW
const bcrypt = require('bcrypt')

const userH = require('../helpers/userHelper')
const productH = require('../helpers/productHelper')
const { request } = require('express')

module.exports = {
    loginpage: (req, res) => {
        if (req.session.loggedIn) {
            res.redirect('/')
        }
        else {
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
            res.redirect('/users/login')

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
        const userid = req.session.userId
        const cartProduct = await userH.findProduct(userid)
        const cartItems = cartProduct.cart || [];
        

        if(cartItems.length>0){
        try {

            const cartCount = cartItems.length
            console.log('cartCount', cartCount);
            

            
            const sum = cartItems.reduce((sum, item) => sum + (item.quantity * item.productId.price), 0)
            const totalSum = sum + 5

            console.log(totalSum);

            res.render('users/cart', { cartItems,sum,totalSum,cartCount})


        } catch (error) {
            console.error('product not found', error);

        }
    }
    else{
        res.render('users/cart',{cartItems:[]})
    }


    },
    addTocart: async (req, res) => {
        const Productid = req.params.id
        const userid = req.session.userId
        const Product = await productH.findItem(Productid)
        const Price = Product.price
        console.log(Price);


        try {
            // const selectedItem=await productH.findItem(productid)
            const arrayItems = {
                productid: Productid,
                quantity: 1,
                price:Price
            }
            await userH.pushTOcart(arrayItems, userid)

            res.redirect('/users/cart')


        } catch (error) {
            console.error(error)
            res.status(500).send('Internal Server Error');
        }
    },
    quantityUpdate: async (req, res) => {
        const userid = req.session.userId;
        var cartProduct = await userH.findProduct(userid)
        const cart = cartProduct.cart
        let updatedprice 

        // const cartItems = cartProduct.cart || [];
        // const sum = cartItems.reduce((sum, item) => sum + (item.quantity * item.productId.price), 0)
        // const totalSum = sum + 5

        const { productId, action } = req.body;
        // console.log(productId, action);
        // console.log(req.body);
        try {
            if (action == 'increase') {
                const updatedquantity = await userH.updateCartInc(userid, productId)
                // updated cart
                var cartProductF = await userH.findProduct(userid)
                let sum
                cartProductF.cart.forEach(item => {
                    if(item.productId._id==productId){
                    updatedprice = item.productId.price * updatedquantity

                    userH.updateUserCart(userid, productId, updatedprice)
                    }
                    sum += item.productId.price * item.quantity;
                    // console.log('itemquantity',item.quantity);
                    
                })
                
                const totalSum = sum + 5;


                // console.log('updatedprice',updatedprice);
                // console.log('sum',sum);

                
                // console.log('last updated qty',updatedquantity);
                res.json({ quantity: updatedquantity, price: updatedprice, cartSum: sum, cartTotal: totalSum })

            } else {
                if (action == 'decrease') {
                    const updatedquantity = await userH.updateCartDec(userid, productId)
                    // updated cart
                    var cartProductF = await userH.findProduct(userid)
                    let sum=0
                    
                    cartProductF.cart.forEach(item => {
                        if(item.productId._id == productId){
                        updatedprice = item.productId.price * updatedquantity
                     
                        userH.updateUserCart(userid, productId, updatedprice)
                        }  

                        sum += item.productId.price * item.quantity;

                    })

                    const totalSum = sum + 5;



                    // console.log('updatedprice',updatedprice);

                    

                    // console.log('last updated qty',updatedquantity);
                    res.json({ quantity: updatedquantity, price: updatedprice, cartSum: sum, cartTotal: totalSum })
                }

            }

        } catch (error) {

            console.error('inc/dec issue', error);
        }


    },
    cartItemRemove: async (req, res) => {
        const userid = req.session.userId;
        const { productId } = req.body;
        console.log('for removing:',productId)
        console.log('userid:',userid);
        let sum=0
        try {
           const updatedCart= await userH.removeItem(userid, productId)
            //   console.log('updatedCartaaaaaa',updatedCart);
           updatedCart.forEach(item => {
            
            sum += item.price * item.quantity;
            // console.log('sum',sum);
            
        })
        const cartCount = updatedCart.length
        let totalSum;
        if(sum==0){
            totalSum=0

        }
        else{
            totalSum = sum + 5;
        }
         
            // Send the response
            res.json({ success: true, cartSum: sum, cartTotal: totalSum, cartCount: cartCount})
        } catch (error) {
            console.error('remove issue', error);
            res.json({ success: false });
        }
    }

} 