const express = require('express')
const router = express.Router()
const controller = require('../controllers/user.controller')

router.post('/register', controller.create)
router.post('/login', controller.authenticate)
router.post('/find', controller.find)
router.put('/update', controller.patch)
router.put('/update/edit', controller.pathEdit)
router.delete('/delete', controller.destroy)
router.get('/test', controller.get)
router.get('/list', controller.all)
router.post('/list/asrole', controller.listAsRole)
router.post('/list/asroleasweb', controller.listAsRoleAsWeb)
router.post('/list/cso/bywebsite', controller.userListByWebsite)
router.post('/check/token', controller.checkToken)
router.post('/change/password', controller.changePassword)
router.post('/reset/password', controller.resetPassword)

module.exports = router