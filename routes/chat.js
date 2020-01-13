const express = require('express')
const router = express.Router()
const controller = require('../controllers/chat.controller')
const upload = require('../middleware/multer')

router.post('/new/channel', controller.createNewChannel)
router.post('/list/active/bywebsite', controller.listActiveChatByWebsite)
router.post('/findbyid', controller.getChatById)
router.post('/new/message/operator', controller.sendNewMessageAsOperator)
router.post('/new/message/guest', controller.sendNewMessageAsGuest)
router.post('/assign/operator', controller.assignOperator)
router.post('/attach/guest', upload.single('attach'), controller.sendImageAsGuest)

module.exports = router