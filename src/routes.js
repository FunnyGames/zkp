const express = require('express');
const router = express.Router();

const controllers = require('./controllers');

router.get('/api/main', controllers.main);

router.use('*', controllers.indexFile);

module.exports = router;