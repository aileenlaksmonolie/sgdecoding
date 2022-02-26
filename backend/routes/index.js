const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/speech', require('./speech.routes'));
router.use('/users', require('./users.routes'));
router.use('/files', require('./files.routes'));

module.exports = router;