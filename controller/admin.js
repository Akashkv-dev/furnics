const adminkey = process.env.ADMINKEY
const adminpw = process.env.ADMINPW
module.exports = {

    adminAuth: (req, res) => {
        if (adminkey == req.body.email) {
            if (adminpw == req.body.password) {

                res.redirect('/admin/dashboard')
                console.log(req.body.email);

            }
            else {

                res.redirect('/users/login')

            }
        }
        else {
            res.redirect('/users/login')

        }
    },


    dashboard:(req,res)=>{
        res.render('admin/admin')
    }
}