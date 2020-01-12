const express = require('express')
const router = express.Router()
const controller = require('../controllers/chat.controller')

router.post('/new/channel', controller.createNewChannel)
router.post('/new/message/guest', controller.sendNewMessageAsGuest)
router.post('/assign/operator', controller.assignOperator)
router.post('/list/message/bychannel', controller.listMessageByChannel)

module.exports = router