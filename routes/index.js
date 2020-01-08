const router     = require('express').Router();
const authRouter = require('./auth');
const websiteRouter = require('./website');

router.use('/auth', authRouter)
router.use('/website', websiteRouter)

module.exports = router;