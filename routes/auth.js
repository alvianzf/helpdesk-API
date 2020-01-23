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
router.get('/list/admin', controller.adminList)
router.get('/list/cso', controller.userList)
router.post('/list/cso/bywebsite', controller.userListByWebsite)
router.post('/check/token', controller.checkToken)
router.post('/change/password', controller.changePassword)

module.exports = router