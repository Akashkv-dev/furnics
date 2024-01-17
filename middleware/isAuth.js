const isAuth = function (req,res,next){
    if(req.session.loggedIn){
        next();
    }
    else{
        res.render('users/login')
    }    
}
module.exports = isAuth;