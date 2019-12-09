const express = require('express');
const router = express.Router();
const controllerRelease = require('../controller/controller.release');
const { ensureAuthenticated } = require('../config/authenticated');

router.get('/release/:projectId', ensureAuthenticated, controllerRelease.displayRelease);
module.exports = router;
