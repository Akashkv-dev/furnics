const isAuth = function (req,res,next){
    if(req.session.userId){
        next();
    }
    else{
        res.render('users/login')
    }    
}
module.exports = isAuth;