module.exports={
    homepage:(req, res, next)=> {
        res.render('users/index', { title: 'Furnics' })
      }

}