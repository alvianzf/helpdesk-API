const express = require('express')
const router = express.Router()
const controller = require('../controllers/user.controller')

router.post('/register', controller.create)
router.get('/test', controller.get)
router.get('/list', controller.all)
router.get('/list/admin', controller.adminList)
router.get('/list/cso', controller.userList)

module.exports = router