
const adminkey = process.env.ADMINKEY
const adminpw = process.env.ADMINPW
const bcrypt = require('bcrypt')

const userH = require('../helpers/userHelper')
const productH = require('../helpers/productHelper')
const { request } = require('express')
const otp = require('../config/otp')

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

        


        if (!valid) {
            res.render('users/login', { invalid: "invalid email" })
        }
        else {
            const currentPassword = await bcrypt.compare(req.body.password, valid.password)
        console.log(currentPassword);
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
        const cartItems = cartProduct.cart.cart || [];
        

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
        const cart = cartProduct.cart.cart
        let updatedprice;
        let totalSum;

        const { productId, action } = req.body;
        // console.log(productId, action);
        // console.log(req.body);
        const product  = await productH.findItem(productId)
        const stock = product.quantity

        // console.log('stock',stock.quantity);
        try {
            if (action == 'increase' ) {
                const updatedquantity = await userH.updateCartInc(userid, productId,stock)

                // if(updatedquantity<=stock.quantity){
                // updated cart
                var cartProductF = await userH.findProduct(userid)

                let sum=0
                cartProductF.cart.cart.forEach(item => {
                    if(item.productId._id==productId){
                    updatedprice = item.productId.price * updatedquantity

                    userH.updateUserCart(userid, productId, updatedprice)
                    }
                    sum += item.productId.price * item.quantity;
                    // console.log('itemquantity',item.quantity);
                    
                })
                
                 totalSum = sum + 5;


                // console.log('updatedprice',updatedprice);
                // console.log('sum',sum);

                
                // console.log('last updated qty',updatedquantity);
                res.json({ quantity: updatedquantity, price: updatedprice, cartSum: sum, cartTotal: totalSum })
            // }
            // else{
            //     res.json('outofstock')
            // }

            } else {
                if (action == 'decrease') {
                    const updatedquantity = await userH.updateCartDec(userid, productId)
                    
                    // updated cart
                    var cartProductF = await userH.findProduct(userid)
                    let sum=0
                    
                    cartProductF.cart.cart.forEach(item => {
                        if(item.productId._id == productId){
                        updatedprice = item.productId.price * updatedquantity
                     
                        userH.updateUserCart(userid, productId, updatedprice)
                        }  

                        sum += item.productId.price * item.quantity;

                    })

                     totalSum = sum + 5;
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
        // console.log('for removing:',productId)
        // console.log('userid:',userid);
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
    },
    productpage:async (req,res)=>{
        const productId =req.params.id
        const item =await productH.findItem(productId)
        const isUser = req.session.loggedIn
        // console.log('product',product);

        res.render('users/productpage',{item,isUser})
    },
    edituser: async (req, res) => {
        const userid = req.session.userId
        const data = await userH.findedituserbyid(userid)
        console.log(data);

        res.render('users/profile', { data: data })
    },
    updateuser: async (req, res) => {
        const userid = req.params.id
        const datas = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
        }
        console.log(datas);
        await userH.insertupdate(datas, userid);
        res.redirect('/users/profile')
    },
    forgotpassword: async (req, res) => {
        res.render('users/forgotpassword')
    },
    validateotp: async (req, res) => {

        const result = await userH.findedituserbyid(req.body.id)
        if ((req.body.enteredOTP) && (result)) {
          if (result.verification == req.body.enteredOTP) {
            await userH.verified(req.body.id)
            res.json({ success: true })
            await userH.gmail(result.email, result.name) //welcome mail
            res.render('users/login')
          }
          else {
            await userH.delete(req.body._id)
            res.json({ success: false });
          }
        }
        else {
          await userH.delete(req.body._id)
          res.status(422).json({ error: "Field can't be empty!" })
        }
      },
      timeexeed: async (req, res) => {
        const proid = req.params.id
        await userH.delete(proid)
        res.render('users/signup')
      },
      sendotp: async (req, res) => {
        const result = await userH.validUser(req.body.email)
        if (result) {
          const generatedotp = await otp.generateOTP()
          await otp.sendOTPEmail(req.body.email, generatedotp);
          res.json(generatedotp)
        }
        else {
          res.json({ error: "error" })
        }
      },
      resetpassword: async (req, res) => {
        const hashpassword = await bcrypt.hash(req.body.newPassword, 10)
        await userH.forgotpassword(req.body.email, hashpassword)
        res.json("success")
      }

   

} 