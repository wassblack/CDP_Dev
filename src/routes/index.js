const express = require('express');
const router = express.Router();
const controllerIndex = require('../controller/controller.index');
//Must add to every resource access page
const { ensureAuthenticated } = require('../config/authenticated');

//Display all the projects in which the user contributes
router.get('/', ensureAuthenticated, controllerIndex.redirectToIndex);

//Passing ensureAuthenticated
router.get('/Projects', ensureAuthenticated, controllerIndex.displayIndex);


module.exports = router;
