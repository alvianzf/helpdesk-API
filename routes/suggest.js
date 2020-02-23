const express = require('express')
const router = express.Router()
const controller = require('../controllers/suggest.controller')

router.get('/list', controller.get)
router.post('/find', controller.find)
router.post('/save', controller.create)
router.put('/update', controller.update)
router.delete('/delete', controller.destroy)

module.exports = router