const express = require('express');
const router = express.Router();
const controllerProject = require('../controller/controller.project');
const { ensureAuthenticated } = require('../config/authenticated');

router.get('/createProject', ensureAuthenticated, controllerProject.displayCreateProject);

router.post('/createProject', ensureAuthenticated, controllerProject.createProject);


module.exports = router;
