const router     = require('express').Router();
const authRouter = require('./auth');
const websiteRouter = require('./website');
const chatRouter = require('./chat');
const widgetRouter = require('./widget');
const suggestRouter = require('./suggest');

router.use('/auth', authRouter)
router.use('/website', websiteRouter)
router.use('/chat', chatRouter)
router.use('/widget', widgetRouter)
router.use('/suggest', suggestRouter)

module.exports = router;