const express = require('express');
const router = express.Router();
const controllerIndex = require('../controller/controller.index');
//Must add to every resource access page
const { ensureAuthenticated } = require('../config/authenticated');

/**
 * @swagger
 * /:
 *  get:
 *    description: Redirect to /Projects
 *  responses:
 *    200':
 *      description: redirection success
 */
router.get('/', ensureAuthenticated, controllerIndex.redirectToIndex);

/**
 * @swagger
 * /Projects:
 *  get:
 *    description: Display the list of projects in which the user contributes
 *  responses:
 *    200':
 *      description: display success
 */
router.get('/Projects', ensureAuthenticated, controllerIndex.displayIndex);


module.exports = router;
