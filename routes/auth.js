const express = require('express')
const router = express.Router()
const controller = require('../controllers/user.controller')

router.post('/register', controller.create)
router.get('/test', controller.get)

module.exports = router