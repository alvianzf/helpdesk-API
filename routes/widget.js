const express = require('express')
const router = express.Router()
const controller = require('../controllers/widget.controller')

router.get('/list', controller.get)

module.exports = router