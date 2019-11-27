const express = require('express');
const router = express.Router();
const controllerTask = require('../controller/controller.task');
const controllerProject = require('../controller/controller.project');

const { ensureAuthenticated } = require('../config/authenticated');

// Page displaying the main information about the selected project
router.get('/project/:projectId', ensureAuthenticated, controllerProject.displayProject);

// Modify Project
router.get('/project/:projectId/ModifyProject', ensureAuthenticated, controllerProject.displayModifyProject);

// Modification of the name or description of the selected project
router.post('/project/:projectId', ensureAuthenticated, controllerProject.modifyProject);

// Delete a project  
router.get('/project/:projectId/delete', ensureAuthenticated, controllerProject.deleteProject);

// Display add a user to a project form
router.get('/project/:projectId/addUser', ensureAuthenticated, controllerProject.displayAddUser);

// Add a user to an existing project 
router.post('/project/:projectId/addUser', ensureAuthenticated, controllerProject.addUserToProject);

// Display create task form 
router.get('/project/:projectId/createTask', ensureAuthenticated, controllerTask.displayCreateTask);

// Display modify task form 
router.get('/project/:projectId/modifyTask/:taskId', ensureAuthenticated, controllerTask.displayModifyTask);

// Modify an existing task 
router.post('/project/:projectId/modifyTask/:taskId', ensureAuthenticated, controllerTask.modifyTask);

//Create a new task
router.post('/project/:projectId/createTask', ensureAuthenticated, controllerTask.createTask);

//Delete a task
router.get('/project/:projectId/deleteTask/:taskId', ensureAuthenticated, controllerTask.deleteTask);



module.exports = router;
