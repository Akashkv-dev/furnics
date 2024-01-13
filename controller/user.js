
const adminkey = process.env.ADMINKEY
const adminpw = process.env.ADMINPW
const bcrypt = require('bcrypt')

const users = require('../helpers/userHelper')
const Products=require('../helpers/productHelper')

module.exports={
    loginpage:(req,res)=>{
        res.render('users/login')
    },
    userAuth:async (req, res) => {

        const valid=await users.validUser(req.body.email)
    
        const currentPassword=await bcrypt.compare(req.body.password,valid.password)
        console.log(currentPassword);


        if(!valid){
            res.render('users/login',{invalid:"invalid email"})
        }
        else{
            console.log(req.body);
            console.log(adminkey,adminpw);
            if (adminkey == req.body.email && adminpw == req.body.password) {
                res.redirect('/admin/dashboard')
                    console.log(req.body.email); 
            }
            else if(currentPassword){
                
                req.session.user = req.body
                req.session.loggedIn = true
                console.log("User logged in");
                res.redirect('/')
    
            }
            else{
                
                res.render('users/login',{invalid:"invalid password"})
            }  

        }     
    },
    loggedIn:(res,req)=>{


    },
    signpage:(req,res)=>{
        res.render('users/signup')
    },
    signUp:async function(req,res){
        try {
            console.log(req.body);
      const details={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        phone:req.body.phone,
        }
        const hashpassword=await bcrypt.hash(req.body.password,10)
        details.password=hashpassword
        await users.insertData(details)
        res.redirect('/login')
            
        } catch (error) {
            console.log('existing user',error);
            res.render('users/signup',{invalid:"existing user"})
            
        }
        
    },
    logout:(req,res)=>{
        req.session.destroy()
        res.redirect('/')
    },
    allproducts:async (req,res)=>{
       const prodata =await Products.allproducts()
       const isUser =req.session.loggedIn
        res.render('users/allproducts',{prodata,isUser})
    }
} 