const user=require('../modals/User')
module.exports={
    loginpage:(req,res)=>{
        res.render('users/login')
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
        address:req.body.address,
        city:req.body.city,
        zip:req.body.zip
        }
        await user.insertMany(details)
    }
} 