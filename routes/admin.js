const express =require('express')
const router =express.Router()
const {adminAuth,dashboard,addproducts,adminlogout} =require('../controller/admin.js')

router.post('/signin',adminAuth)
router.get('/dashboard',dashboard)
router.get('/addproducts',addproducts)
router.get('/logout',adminlogout)

module.exports = router;
