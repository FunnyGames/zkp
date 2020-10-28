const express = require('express');
const router = express.Router();

const controllers = require('./controllers');

router.post('/api/start', controllers.startSimulation);
router.post('/api/next', controllers.nextIteration);

router.use('*', controllers.indexFile);

module.exports = router;