const express = require('express')
const router = express.Router()
const controller = require('../controllers/chat.controller')
const upload = require('../middleware/multer')

router.post('/new/channel', controller.createNewChannel)
router.get('/list/new/global', controller.listNewGlobal)
router.post('/list/new/group', controller.listNewGlobalGroup)
router.post('/list/active/chat', controller.listCurrentChat)
router.get('/list/close/global', controller.listCloseGlobal)
router.post('/list/close/group', controller.listCloseGroup)
router.post('/findbyid', controller.getChatById)
router.post('/findbyidandsetminimize', controller.getChatAndSetMinimize)
router.post('/new/message/operator', controller.sendNewMessageAsOperator)
router.post('/new/message/guest', controller.sendNewMessageAsGuest)
router.post('/new/message/system', controller.sendNewMessageAsSystem)
router.post('/assign/operator', controller.assignOperator)
router.post('/attach/guest', upload.single('attach'), controller.sendImageAsGuest)
router.post('/attach/operator', upload.single('attach'), controller.sendImageAsOperator)
router.post('/close', controller.endChatById)
router.post('/transfer', controller.transferChatById)
router.post('/count/chatoperator', controller.allChatOperator)
router.get('/count/chat', controller.allChat)
router.post('/count/chatopenoperator', controller.allChatOpenOperator)
router.get('/count/chatopen', controller.allChatOpen)
router.post('/count/chatactiveoperator', controller.allChatActiveOperator)
router.get('/count/chatactive', controller.allChatActive)
router.post('/count/chatcloseoperator', controller.allChatCloseOperator)
router.get('/count/chatclose', controller.allChatClose)
router.post('/count/unread', controller.countUnreadMessageById)
router.post('/setread', controller.setRead)
router.get('/totalchatperagent', controller.totalChatPerAgent)
router.delete('/destroy', controller.destroy)

module.exports = router