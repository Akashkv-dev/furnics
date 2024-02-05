const express =require('express')
const router =express.Router()
const upload =require('../middleware/multer.js')

const {dashboard,addproducts,adminlogout,productAdded,allorders,productdetail,confirmorder,shiporder,deliverorder,cancelorder,allusers,
edituser,updateuser,deleteuser,allproducts} =require('../controller/admin.js')


router.get('/dashboard',dashboard)
router.get('/logout',adminlogout)
router.get('/addproducts',addproducts)
router.post('/productadded',upload.single('image'),productAdded)
router.get('/allorders',allorders)
router.get('/product/:id',productdetail)
router.get('/confirm/:id',confirmorder)
router.get('/shipped/:id',shiporder)
router.get('/delivered/:id',deliverorder)
router.get('/cancelled/:id',cancelorder)
router.get('/allusers',allusers)
router.get('/edituser/:id',edituser)
router.post('/updateuser/:id',updateuser)
router.get('/deleteuser/:id',deleteuser)
router.get('/allproducts',allproducts)

module.exports = router;

