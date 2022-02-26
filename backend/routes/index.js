const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/speech', require('./speech.routes'));

module.exports = router;