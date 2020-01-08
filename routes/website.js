const express = require('express')
const router = express.Router()
const controller = require('../controllers/website.controller')

router.get('/list', controller.get)
router.post('/save', controller.create)
router.post('/find', controller.find)
router.put('/update', controller.patch)
router.delete('/delete', controller.destroy)

module.exports = router