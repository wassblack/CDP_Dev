const express = require('express');
const router = express.Router();
const controllerUserStory = require('../controller/controller.userStory');
const { ensureAuthenticated } = require('../config/authenticated');
//Display create userStory form
router.get('/project/:projectId/createUserStory', ensureAuthenticated, controllerUserStory.displayCreateUserStory);
//Create a user story
router.post('/project/:projectId/createUserStory', ensureAuthenticated, controllerUserStory.createUserStory);
//Display edit user story form
router.get('/project/:projectId/editUserStory/:userStoryId', ensureAuthenticated, controllerUserStory.displayEditUserStory);
//Modify an existing user story
router.post('/project/:projectId/editUserStory', ensureAuthenticated, controllerUserStory.editUserStory);
//Delete an existing user story
router.get('/project/:projectId/deleteUserStory/:userStoryId/:sprintId', ensureAuthenticated, controllerUserStory.deleteUserStory);



module.exports = router;

