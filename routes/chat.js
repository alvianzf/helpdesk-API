const express = require('express')
const router = express.Router()
const controller = require('../controllers/chat.controller')

router.post('/new/channel', controller.createNewChannel)
router.post('/list/active/bywebsite', controller.listActiveChatByWebsite)
router.post('/findbyid', controller.getChatById)
router.post('/new/message/operator', controller.sendNewMessageAsOperator)
router.post('/assign/operator', controller.assignOperator)

module.exports = router