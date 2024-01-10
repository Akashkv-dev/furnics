const user=require('../modals/User')
const adminkey = process.env.ADMINKEY
const adminpw = process.env.ADMINPW

const users = require('../helpers/userHelper')

module.exports={
    loginpage:(req,res)=>{
        res.render('users/login')
    },
    userAuth:async (req, res) => {
        const valid=await users.validUser(req.body.email)

        if(!valid){
            res.render('users/login',{invalid:"invalid email"})
        }
        else{
            console.log(req.body);
            console.log(adminkey,adminpw);
            if (adminkey == req.body.email && adminpw == req.body.password) {
console.log("hello");
                res.redirect('/admin/dashboard')
                    console.log(req.body.email); 
            }
            else if(valid.email==req.body.email && valid.password==req.body.password){
                passwordMatch=true;
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
        await user.insertMany(details)
    }
} 