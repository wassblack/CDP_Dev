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
 *      - in: path
 *        name: projectId
 *        schema: 
 *          type: string
 *        description: Id of the project
 *  responses:
 *    200':
 *      description: display success
 */
router.get('/project/:projectId', ensureAuthenticated, controllerProject.displayProject);

/**
 * @swagger
 * /project/{projectId}/ModifyProject:
 *  get:
 *    description: Page displaying the modification form of the selected project
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
router.get('/project/:projectId/ModifyProject', ensureAuthenticated, controllerProject.displayModifyProject);

/**
 * @swagger
 * /project/{projectId}:
 *  post:
 *    description: Update project name or description
 *  parameters:
 *      - in: path
 *        name: projectId
 *        schema: 
 *          type: string
 *        description: Id of the project
 *      - in: formData
 *        name: projectName
 *        schema: 
 *          type: string
 *        description:  New project name
 *      - in: formData
 *        name: projectDesc
 *        schema: 
 *          type: string
 *        description:  New project description
 *  responses:
 *    200':
 *      description: redirect to main page
 */
router.post('/project/:projectId', ensureAuthenticated, controllerProject.modifyProject);

/**
 * @swagger
 * /project/{projectId}/delete:
 *  get:
 *    description: Deletes the selected project
 *  parameters:
 *      - in: path
 *        name: projectId
 *        schema: 
 *          type: string
 *        description: Id of the project
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
 *      - in: path
 *        name: projectId
 *        schema: 
 *          type: string
 *        description: Id of the project
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
 *      - in: path
 *        name: projectId
 *        schema: 
 *          type: string
 *        description: Id of the project
 *      - in: formData
 *        name: newUser
 *        schema: 
 *          type: string
 *        description: email of the user to add 
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
 *      - in: path
 *        name: projectId
 *        schema: 
 *          type: string
 *        description: Id of the project
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
 *      - in: path
 *        name: projectId
 *        schema: 
 *          type: string
 *        description: Id of the project
 *      - in: path
 *        name: taskId
 *        schema: 
 *          type: string
 *        description: id of the task to modify  
 *  responses:
 *    200':
 *      description: displays the update task page
 */
router.get('/project/:projectId/modifyTask/:taskId', ensureAuthenticated, controllerTask.displayModifyTask);

/**
 * @swagger
 * /project/{projectId}/modifyTask/{taskId}:
 *  post:
 *    description: Updates an existing task
 *  parameters:
 *      - in: path
 *        name: projectId
 *        schema: 
 *          type: string
 *        description: Id of the project
 *      - in: path
 *        name: taskId
 *        schema: 
 *          type: string
 *        description: Id of the task
 *      - in: formData
 *        name: description
 *        schema: 
 *          type: string
 *        description:  New task description
 *      - in: formData
 *        name: developerId
 *        schema: 
 *          type: string
 *        description:  New task developer
 *      - in: formData
 *        name: state
 *        schema: 
 *          type: number
 *        description:  New task state        
 *  responses:
 *    200':
 *      description: displays the main project page
 */
router.post('/project/:projectId/modifyTask/:taskId', ensureAuthenticated, controllerTask.modifyTask);

/**
 * @swagger
 * /project/{projectId}/createTask:
 *  post:
 *    description: Creates a new task
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
 *        description: task description
 *      - in: formData
 *        name: developerId
 *        schema: 
 *          type: string
 *        description: task developer id
 *      - in: formData
 *        name: task state
 *        schema: 
 *          type: number
 *        description: task state        
 *  responses:
 *    200':
 *      description: displays the main project page
 */
router.post('/project/:projectId/createTask', ensureAuthenticated, controllerTask.createTask);

/**
 * @swagger
 * /project/{projectId}/deleteTask/{taskId}:
 *  get:
 *    description:  Deletes the selected task
 *  parameters:
 *      - in: path
 *        name: projectId
 *        schema: 
 *          type: string
 *        description: Id of the project
 *      - in: path
 *        name: taskId
 *        schema: 
 *          type: string
 *        description: Id of the task
 *  responses:
 *    200':
 *      description: displays the main project page
 */
router.get('/project/:projectId/deleteTask/:taskId', ensureAuthenticated, controllerTask.deleteTask);

/**
 * @swagger
 * /project/{projectId}/linkTask/{taskId}:
 *  post:
 *    description: link a task to an existing userStory
 *  parameters:
 *      - in: path
 *        name: projectId
 *        schema: 
 *          type: string
 *        description: Id of the project
 *      - in: path
 *        name: taskId
 *        schema: 
 *          type: string
 *        description: Id of the task
 *      - in: formData
 *        name: selectedUs
 *        schema: 
 *          type: json
 *        description: User story to link 
 *  responses:
 *    200':
 *      description: displays the main project page
 */
router.post('/project/:projectId/linkTask/:taskId', ensureAuthenticated, controllerTask.linkTask);

/**
 * @swagger
 * /project/{projectId}/unlinkTask/{sprintId}/{taskId}/{userStoryId}:
 *  post:
 *    description: unlink a userStory from a task
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
 *        description: Sprint id of the userStory to unlink 
 *      - in: path
 *        name: taskId
 *        schema: 
 *          type: string
 *        description: Task id of the linked user story
 *      - in: path
 *        name: userStoryId
 *        schema: 
 *          type: string
 *        description: userStory id
 *  responses:
 *    200':
 *      description: displays the main project page
 */
router.post('/project/:projectId/unlinkTask/:sprintId/:taskId/:userStoryId', ensureAuthenticated, controllerTask.unlinkTask);

/**
 * @swagger
 * /project/{projectId}/tests:
 *  get:
 *    description: Page displaying the tests related to the selected project
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
router.get('/project/:projectId/tests', ensureAuthenticated, controllerTests.displayTests);

/**
 * @swagger
 * /project/{projectId}/createTest:
 *  get:
 *    description: Display create test for a project form
 *  parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        description: Id of the project
 *  responses:
 *    200':
 *      description: displays the create test for a project page
 */
router.get('/project/:projectId/createTest', ensureAuthenticated, controllerTests.displayCreateTest);

/**
 * @swagger
 * /project/{projectId}/createTest:
 *  post:
 *    description: Create a test for a project
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
 *        description: test name
 *      - in: formData
 *        name: description
 *        schema:
 *          type: string
 *        description: test description
 *      - in: formData
 *        name: state
 *        schema:
 *          type: string
 *        description: test state
 *      - in: formData
 *        name: selectedUs
 *        schema:
 *          type: string
 *        description: user story to link with the test
 *  responses:
 *    200':
 *      description: displays the current project's tests page
 */
router.post('/project/:projectId/createTest', ensureAuthenticated, controllerTests.createTest);

/**
 * @swagger
 * /project/{projectId}/modifyTest/{testId}:
 *  get:
 *    description: Display modify test form
 *  parameters:
 *      - in: path
 *        name: projectId
 *        schema:
 *          type: string
 *        description: Id of the project
 *      - in: path
 *        name: testId
 *        schema:
 *          type: string
 *        description: Id of the test to modify
 *  responses:
 *    200':
 *      description: displays the update test page
 */
router.get('/project/:projectId/modifyTest/:testId', ensureAuthenticated, controllerTests.displayModifyTest);

/**
 * @swagger
 * /project/{projectId}/modifyTest/{testId}:
 *  post:
 *    description: Updates an existing test
 *  parameters:
 *      - in: path
 *        name: projectId
 *        schema:
 *          type: string
 *        description: Id of the project
 *      - in: path
 *        name: taskId
 *        schema:
 *          type: string
 *        description: Id of the task
 *      - in: formData
 *        name: name
 *        schema:
 *          type: string
 *        description: new test name
 *      - in: formData
 *        name: description
 *        schema:
 *          type: string
 *        description: new test description
 *      - in: formData
 *        name: state
 *        schema:
 *          type: string
 *        description: new test state
 *      - in: formData
 *        name: selectedUs
 *        schema:
 *          type: string
 *        description: new user story id
 *  responses:
 *    200':
 *      description: displays the current project's tests page
 * 
 */
router.post('/project/:projectId/modifyTest/:testId', ensureAuthenticated, controllerTests.modifyTest);

/**
 * @swagger
 * /project/{projectId}/deleteTest/{testId}:
 *  get:
 *    description: Deletes the selected test
 *  parameters:
 *      - in: path
 *        name: projectId
 *        schema:
 *          type: string
 *        description: Id of the project
 *      - in: path
 *        name: testId
 *        schema:
 *          type: string
 *        description: Id of the test
 *  responses:
 *    200':
 *      description: displays the current project's tests page
 */
router.get('/project/:projectId/deleteTest/:testId', ensureAuthenticated, controllerTests.deleteTest);

module.exports = router;
