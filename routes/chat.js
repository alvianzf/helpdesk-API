const express = require('express')
const router = express.Router()
const controller = require('../controllers/chat.controller')

router.post('/new/channel', controller.createNewChannel)

module.exports = router