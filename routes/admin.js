const express =require('express')
const router =express.Router()
const {adminAuth,dashboard} =require('../controller/admin.js')

router.post('/signin',adminAuth)
router.get('/dashboard',dashboard)

module.exports = router;
