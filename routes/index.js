const router     = require('express').Router();
const authRouter = require('./auth');
const websiteRouter = require('./website');
const chatRouter = require('./chat');

router.use('/auth', authRouter)
router.use('/website', websiteRouter)
router.use('/chat', chatRouter)

module.exports = router;