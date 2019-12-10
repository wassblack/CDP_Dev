const express = require('express');
const router = express.Router();
const controllerUserStory = require('../controller/controller.userStory');
const { ensureAuthenticated } = require('../config/authenticated');

/**
 * @swagger
 * /project/{projectId}/createUserStory:
 *  get:
 *    description: Display the form to create a new userstory
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
router.get('/project/:projectId/createUserStory', ensureAuthenticated, controllerUserStory.displayCreateUserStory);

/**
 * @swagger
 * /project/{projectId}/createUserStory:
 *  post:
 *    description: Create a new userstory
 *  parameters:
 *      - in: path
 *        name: projectId
 *        schema:
 *          type: string
 *        description: Id of the project
 *      - in: formData
 *        name: description
 *        schema:
 *          type: string
 *        description:  Description of the userstory
 *      - in: formData
 *        name: difficulty
 *        schema:
 *          type: string
 *        description:  Difficilty of the userstory
 *      - in: formData
 *        name: priority
 *        schema:
 *          type: string
 *        description:  Priority of the userstory
 *  responses:
 *    200':
 *      description: success, redirect to the project's main page
 */
router.post('/project/:projectId/createUserStory', ensureAuthenticated, controllerUserStory.createUserStory);

/**
 * @swagger
 * /project/{projectId}/editUserStory/{userStoryId}:
 *  get:
 *    description: Display the form to modify a userstory
 *  parameters:
 *      - in: path
 *        name: projectId
 *        schema:
 *          type: string
 *        description: Id of the project
 *      - in: path
 *        name: userStoryId
 *        schema:
 *          type: string
 *        description: Id of the userstory to modify
 *  responses:
 *    200':
 *      description: display success
 */
router.get('/project/:projectId/editUserStory/:userStoryId', ensureAuthenticated, controllerUserStory.displayEditUserStory);

/**
 * @swagger
 * /project/{projectId}/editUserStory/{userStoryId}:
 *  post:
 *    description: Modify an existing userstory
 *  parameters:
 *      - in: path
 *        name: projectId
 *        schema:
 *          type: string
 *        description: Id of the project
 *      - in: path
 *        name: userStoryId
 *        schema:
 *          type: string
 *        description: Id of the userstory to modify
 *      - in: formData
 *        name: description
 *        schema:
 *          type: string
 *        description:  Description of the userstory
 *      - in: formData
 *        name: difficulty
 *        schema:
 *          type: string
 *        description:  Difficilty of the userstory
 *      - in: formData
 *        name: priority
 *        schema:
 *          type: string
 *        description:  Priority of the userstory
 *  responses:
 *    200':
 *      description: success, redirect to the project's main page
 */
router.post('/project/:projectId/editUserStory/:userStoryId', ensureAuthenticated, controllerUserStory.editUserStory);

/**
 * @swagger
 * /project/{projectId}/deleteUserStory/{userStoryId}/{sprintId}:
 *  get:
 *    description: Delete an existing userstory
 *  parameters:
 *      - in: path
 *        name: projectId
 *        schema:
 *          type: string
 *        description: Id of the project
 *      - in: path
 *        name: userStoryId
 *        schema:
 *          type: string
 *        description: Id of the userstory to modify
 *      - in: path
 *        name: sprintId
 *        schema:
 *          type: string
 *        description: Id of the sprint in which is the userstory
 *  responses:
 *    200':
 *      description: delete success
 */
router.get('/project/:projectId/deleteUserStory/:userStoryId/:sprintId', ensureAuthenticated, controllerUserStory.deleteUserStory);


module.exports = router;
