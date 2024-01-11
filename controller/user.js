const User=require('../modals/User')
const adminkey = process.env.ADMINKEY
const adminpw = process.env.ADMINPW
const bcrypt = require('bcrypt')

const users = require('../helpers/userHelper')

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
        console.log(req.body);
      const details={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        phone:req.body.phone,
        }
        const hashpassword=await bcrypt.hash(req.body.password,10)
        details.password=hashpassword
        await User.insertMany(details)
    },
    logout:(req,res)=>{
        req.session.destroy()
        res.redirect('/')
    }
} 