const express = require('express')
const router = express.Router()
const controller = require('../controllers/widget.controller')
const upload = require('../middleware/multer')

router.get('/list', controller.get)
router.post('/create', controller.create)
router.post('/update', upload.single('logo'), controller.update)
router.post('/manage-splash-screen', upload.single('attach'), controller.manageSplashScreen)
module.exports = router