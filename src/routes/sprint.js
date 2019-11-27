const express = require('express');
const router = express.Router();
const controllerSprint = require('../controller/controller.sprint');
const { ensureAuthenticated } = require('../config/authenticated');

router.get('/project/:projectId/createSprint', ensureAuthenticated, controllerSprint.displayCreateSprint);

router.post('/project/:projectId/createSprint', ensureAuthenticated, controllerSprint.createSprint);

router.get('/project/:projectId/modifySprint/:sprintId', ensureAuthenticated, controllerSprint.displayEditSprint);

router.post('/project/:projectId/modifySprint/:sprintId', ensureAuthenticated, controllerSprint.editSprint);

router.get('/project/:projectId/deleteSprint/:sprintId', ensureAuthenticated, controllerSprint.deleteSprint);

router.post('/project/:projectId/addUs/:sprintId', ensureAuthenticated, controllerSprint.addUserStory);

router.get('/project/:projectId/removeUs/:sprintId/:userStoryId', ensureAuthenticated, controllerSprint.removeUserStory);

router.get('/project/:projectId/editUserStory/:sprintId/:userStoryId', ensureAuthenticated, controllerSprint.displayEditSprintUserStory);

router.post('/project/:projectId/editUserStory/:sprintId/:userStoryId', ensureAuthenticated, controllerSprint.editSprintUserStory);


module.exports = router;
