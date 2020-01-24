const router     = require('express').Router();
const authRouter = require('./auth');
const websiteRouter = require('./website');
const chatRouter = require('./chat');
const widgetRouter = require('./widget');

router.use('/auth', authRouter)
router.use('/website', websiteRouter)
router.use('/chat', chatRouter)
router.use('/widget', widgetRouter)

module.exports = router;