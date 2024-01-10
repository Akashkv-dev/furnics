const express =require('express')
const router =express.Router()
const upload =require('../middleware/multer.js')

const {dashboard,addproducts,adminlogout,productAdded} =require('../controller/admin.js')


router.get('/dashboard',dashboard)
router.get('/addproducts',addproducts)
router.get('/logout',adminlogout)
router.post('/productadded',upload.single('image'),productAdded)

module.exports = router;

