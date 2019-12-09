const express = require('express');
const router = express.Router();
const controllerTask = require('../controller/controller.task');
const controllerProject = require('../controller/controller.project');
const controllerTests = require('../controller/controller.tests');
const { ensureAuthenticated } = require('../config/authenticated');

/**
 * @swagger
 * /project/{projectId}:
 *  get:
 *    description: Page displaying the main information about the selected project
 *  parameters:
 *      - in: query
 *        name: projectId
 *        schema: 
 *          type: string
 *        description: id search query 
 *  responses:
 *    200':
 *      description: display success
 */
router.get('/project/:projectId', ensureAuthenticated, controllerProject.displayProject);

// Modify Project
/**
 * @swagger
 * /project/{projectId}/ModifyProject:
 *  get:
 *    description: Page displaying the modification form of the selected project
 *  parameters:
 *      - in: query
 *        name: id
 *        schema: 
 *          type: string
 *        description: id search query 
 *  responses:
 *    200':
 *      description: display success
 */
router.get('/project/:projectId/ModifyProject', ensureAuthenticated, controllerProject.displayModifyProject);

// Modification of the name or description of the selected project
/**
 * @swagger
 * /project/{projectId}/:
 *  post:
 *    description: Update project name or description
 *  parameters:
 *      - in: query
 *        name: id
 *        schema: 
 *          type: string
 *        description: id project search query 
 *      - in: query
 *        name: Project name
 *        schema: 
 *          type: string
 *        description:  New project name
 *      - in: query
 *        name: Project description
 *        schema: 
 *          type: string
 *        description:  New project description
 *  responses:
 *    200':
 *      description: redirect to main page
 */
router.post('/project/:projectId', ensureAuthenticated, controllerProject.modifyProject);

// Delete a project
/**
 * @swagger
 * /project/{projectId}/delete:
 *  get:
 *    description: Deletes the selected project
 *  parameters:
 *      - in: query
 *        name: id
 *        schema: 
 *          type: string
 *        description: id search query 
 *  responses:
 *    200':
 *      description: display the main page
 */
router.get('/project/:projectId/delete', ensureAuthenticated, controllerProject.deleteProject);

/**
 * @swagger
 * /project/{projectId}/addUser:
 *  get:
 *    description: Display add a user to a project form
 *  parameters:
 *      - in: query
 *        name: id
 *        schema: 
 *          type: string
 *        description: id search query 
 *  responses:
 *    200':
 *      description: displays the add user to project page
 */
router.get('/project/:projectId/addUser', ensureAuthenticated, controllerProject.displayAddUser);

/**
 * @swagger
 * /project/{projectId}/addUser:
 *  post:
 *    description:  Adds a user to a project 
 *  parameters:
 *      - in: query
 *        name: projectId
 *        schema: 
 *          type: string
 *        description: id search query 
 *      - in: query
 *        name: userId
 *        schema: 
 *          type: string
 *        description: id of the user to add 
 *  responses:
 *    200':
 *      description: displays the add user to project page
 */
router.post('/project/:projectId/addUser', ensureAuthenticated, controllerProject.addUserToProject);

/**
 * @swagger
 * /project/{projectId}/createTask:
 *  get:
 *    description:  Display create task form
 *  parameters:
 *      - in: query
 *        name: projectId
 *        schema: 
 *          type: string
 *        description: id search query 
 *  responses:
 *    200':
 *      description: displays the create task page
 */
router.get('/project/:projectId/createTask', ensureAuthenticated, controllerTask.displayCreateTask);

/**
 * @swagger
 * /project/{projectId}/modifyTask/{taskId}:
 *  get:
 *    description: Display modify task form
 *  parameters:
 *      - in: query
 *        name: projectId
 *        schema: 
 *          type: string
 *        description: id search query 
 *      - in: query
 *        name: taskId
 *        schema: 
 *          type: string
 *        description: id of the task to modify  
 *  responses:
 *    200':
 *      description: displays the update task page
 */
router.get('/project/:projectId/modifyTask/:taskId', ensureAuthenticated, controllerTask.displayModifyTask);

// Modify an existing task

/**
 * @swagger
 * /project/{projectId}/modifyTask/{taskId}:
 *  post:
 *    description: Updates an existing task
 *  parameters:
 *      - in: query
 *        name: projectId
 *        schema: 
 *          type: string
 *        description: id search query 
 *      - in: query
 *        name: task description
 *        schema: 
 *          type: string
 *        description:  New task description
 *      - in: query
 *        name: task Developer
 *        schema: 
 *          type: string
 *        description:  New task developer
 *      - in: query
 *        name: task state
 *        schema: 
 *          type: number
 *        description:  New task state        
 *  responses:
 *    200':
 *      description: displays the main project page
 */
router.post('/project/:projectId/modifyTask/:taskId', ensureAuthenticated, controllerTask.modifyTask);

//Create a new task
/**
 * @swagger
 * /project/{projectId}/createTask:
 *  post:
 *    description: Creates a new task
 *  parameters:
 *      - in: query
 *        name: projectId
 *        schema: 
 *          type: string
 *        description: id search query 
 *      - in: query
 *        name: task description
 *        schema: 
 *          type: string
 *        description:   task description
 *      - in: query
 *        name: task Developer
 *        schema: 
 *          type: string
 *        description:   task developer
 *      - in: query
 *        name: task state
 *        schema: 
 *          type: number
 *        description:   task state        
 *  responses:
 *    200':
 *      description: displays the main project page
 */
router.post('/project/:projectId/createTask', ensureAuthenticated, controllerTask.createTask);

//Delete a task
/**
 * @swagger
 * /project/{projectId}/deleteTask/{taskId}:
 *  get:
 *    description:  Deletes the selected task
 *  parameters:
 *      - in: query
 *        name: projectId
 *        schema: 
 *          type: string
 *        description: id search query 
 *      - in: query
 *        name: taskId
 *        schema: 
 *          type: string
 *        description: id search query 
 *  responses:
 *    200':
 *      description: displays the main project page
 */
router.get('/project/:projectId/deleteTask/:taskId', ensureAuthenticated, controllerTask.deleteTask);

//link a task
/**
 * @swagger
 * /project/{projectId}/linkTask/{taskId}:
 *  post:
 *    description: link a task to an existing userStory
 *  parameters:
 *      - in: query
 *        name: projectId
 *        schema: 
 *          type: string
 *        description: id search query 
 *      - in: query
 *        name: task description
 *        schema: 
 *          type: json
 *        description: User story to link 
 *  responses:
 *    200':
 *      description: displays the main project page
 */
router.post('/project/:projectId/linkTask/:taskId', ensureAuthenticated, controllerTask.linkTask);

//unlink a user story from a task
/**
 * @swagger
 * /project/{projectId}/unlinkTask/{sprintId}/{taskId}/{userStoryId}:
 *  post:
 *    description: unlink a userStory from a task
 *  parameters:
 *      - in: query
 *        name: projectId
 *        schema: 
 *          type: string
 *        description: id search query 
 *      - in: query
 *        name: sprintId
 *        schema: 
 *          type: string
 *        description: sprint id of the userStory t unlink 
 *      - in: query
 *        name: taskId
 *        schema: 
 *          type: string
 *        description: task id of the linked user story
 *      - in: query
 *        name: userStoryId
 *        schema: 
 *          type: string
 *        description: userStory id
 *  responses:
 *    200':
 *      description: displays the main project page
 */
router.post('/project/:projectId/unlinkTask/:sprintId/:taskId/:userStoryId', ensureAuthenticated, controllerTask.unlinkTask);

// Page displaying the project's tests
router.get('/project/:projectId/tests', ensureAuthenticated, controllerTests.displayTests);

// Display create test form
router.get('/project/:projectId/createTest', ensureAuthenticated, controllerTests.displayCreateTest);

// Create a new test
router.post('/project/:projectId/createTest', ensureAuthenticated, controllerTests.createTest);

// Display modify test form
router.get('/project/:projectId/modifyTest/:testId', ensureAuthenticated, controllerTests.displayModifyTest);

// Modify a test
router.post('/project/:projectId/modifyTest/:testId', ensureAuthenticated, controllerTests.modifyTest);

// Delete a test
router.get('/project/:projectId/deleteTest/:testId', ensureAuthenticated, controllerTests.deleteTest);

module.exports = router;
