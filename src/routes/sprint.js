const express = require('express');
const router = express.Router();
const controllerSprint = require('../controller/controller.sprint');
const { ensureAuthenticated } = require('../config/authenticated');

/**
 * @swagger
 * /project/{projectId}/createSprint:
 *  get:
 *    description: Page displaying the creation form of a sprint
 *  parameters:
 *      - in: path
 *        name: projectId
 *        schema:
 *          type: string
 *        description: Id of the project
 *  responses:
 *    200':
 *      description: display success
 */
router.get('/project/:projectId/createSprint', ensureAuthenticated, controllerSprint.displayCreateSprint);

/**
 * @swagger
 * /project/{projectId}/createSprint:
 *  post:
 *    description: Create a new sprint
 *  parameters:
 *      - in: path
 *        name: projectId
 *        schema:
 *          type: string
 *        description: Id of the project
 *      - in: formData
 *        name: name
 *        schema:
 *          type: string
 *        description:  Sprint name
 *      - in: formData
 *        name: startDate
 *        schema:
 *          type: string
 *        description:  Sprint start date
 *      - in: formData
 *        name: endDate
 *        schema:
 *          type: string
 *        description:  Sprint end date
 *  responses:
 *    200':
 *      description: success, redirect to the project's main page
 */
router.post('/project/:projectId/createSprint', ensureAuthenticated, controllerSprint.createSprint);

/**
 * @swagger
 * /project/{projectId}/modifySprint/{sprintId}:
 *  get:
 *    description: Page displaying the modification form of a sprint
 *  parameters:
 *      - in: path
 *        name: projectId
 *        schema:
 *          type: string
 *        description: Id of the project
 *      - in: path
 *        name: sprintId
 *        schema:
 *          type: string
 *        description: Id of the sprint to modify
 *  responses:
 *    200':
 *      description: display success
 */
router.get('/project/:projectId/modifySprint/:sprintId', ensureAuthenticated, controllerSprint.displayEditSprint);

/**
 * @swagger
 * /project/{projectId}/modifySprint/{sprintId}:
 *  post:
 *    description: Create a new sprint
 *  parameters:
 *      - in: path
 *        name: projectId
 *        schema:
 *          type: string
 *        description: Id of the project
 *      - in: path
 *        name: sprintId
 *        schema:
 *          type: string
 *        description: Id of the sprint
 *      - in: formData
 *        name: name
 *        schema:
 *          type: string
 *        description:  New sprint name
 *      - in: formData
 *        name: startDate
 *        schema:
 *          type: string
 *        description:  New sprint start date
 *      - in: formData
 *        name: endDate
 *        schema:
 *          type: string
 *        description:  New sprint end date
 *  responses:
 *    200':
 *      description: success, redirect to the project's main page
 */
router.post('/project/:projectId/modifySprint/:sprintId', ensureAuthenticated, controllerSprint.editSprint);

/**
 * @swagger
 * /project/{projectId}/deleteSprint/{sprintId}:
 *  get:
 *    description: Delete a sprint
 *  parameters:
 *      - in: path
 *        name: projectId
 *        schema:
 *          type: string
 *        description: Id of the project
 *      - in: path
 *        name: sprintId
 *        schema:
 *          type: string
 *        description: Id of the sprint to delete
 *  responses:
 *    200':
 *      description: delete success
 */
router.get('/project/:projectId/deleteSprint/:sprintId', ensureAuthenticated, controllerSprint.deleteSprint);

/**
 * @swagger
 * /project/{projectId}/addUs/{sprintId}:
 *  post:
 *    description: Add a userstory to a sprint
 *  parameters:
 *      - in: path
 *        name: projectId
 *        schema:
 *          type: string
 *        description: Id of the project
 *      - in: path
 *        name: sprintId
 *        schema:
 *          type: string
 *        description: Id of the sprint
 *      - in: formData
 *        name: selectedUs
 *        schema:
 *          type: string
 *        description:  Userstory to add to the sprint
 *  responses:
 *    200':
 *      description: success, redirect to the project's main page
 */
router.post('/project/:projectId/addUs/:sprintId', ensureAuthenticated, controllerSprint.addUserStory);

/**
 * @swagger
 * /project/{projectId}/removeUs/{sprintId}/{userStoryId}:
 *  get:
 *    description: Remove a userstory from a sprint
 *  parameters:
 *      - in: path
 *        name: projectId
 *        schema:
 *          type: string
 *        description: Id of the project
 *      - in: path
 *        name: sprintId
 *        schema:
 *          type: string
 *        description: Id of the sprint
 *      - in: path
 *        name: userStoryId
 *        schema:
 *          type: string
 *        description: Id of the userstory to remove
 *  responses:
 *    200':
 *      description: remove success
 */
router.get('/project/:projectId/removeUs/:sprintId/:userStoryId', ensureAuthenticated, controllerSprint.removeUserStory);


module.exports = router;
