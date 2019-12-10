const express = require('express');
const router = express.Router();
const controllerProject = require('../controller/controller.project');
const { ensureAuthenticated } = require('../config/authenticated');

/**
 * @swagger
 * /createProject:
 *  get:
 *    description: Display create project form
 *  responses:
 *    200':
 *      description: display success
 */
router.get('/createProject', ensureAuthenticated, controllerProject.displayCreateProject);

/**
 * @swagger
 * /createProject:
 *  post:
 *    description: Create a new project
 *  parameters:
 *      - in: formData
 *        name: name
 *        schema:
 *          type: string
 *        description:  Project name
 *      - in: formData
 *        name: description
 *        schema:
 *          type: string
 *        description:  Project description
 *  responses:
 *    200':
 *      description: success, redirect to the list of projects of the user
 */
router.post('/createProject', ensureAuthenticated, controllerProject.createProject);


module.exports = router;
