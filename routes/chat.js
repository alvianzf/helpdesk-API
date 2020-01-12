const express = require('express')
const router = express.Router()
const controller = require('../controllers/chat.controller')

router.post('/new/channel', controller.createNewChannel)
router.post('/new/message/guest', controller.sendNewMessageAsGuest)
router.post('/find/channel', controller.findChannel)
router.post('/assign/operator', controller.assignOperator)
router.post('/list/message/bychannel', controller.listMessageByChannel)
router.get('/list/active', controller.listOpenChat)
router.get('/list/recent', controller.listRecentChat)

module.exports = router