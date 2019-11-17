const express = require('express');
const router = express.Router();
const moment = require('moment');
const ModelProject = require('../models/project');
const ModelUserStory = require('../models/userStory');
const { ensureAuthenticated } = require('../config/authenticated');

router.get('/project/:projectId/createSprint', ensureAuthenticated, (req, res) => {
    res.render('createSprint', {
        projectId: req.params.projectId,
        user: req.user
    });
});

router.post('/project/:projectId/createSprint', ensureAuthenticated, (req, res) => {
    const errors = [];

    const projectId = req.params.projectId;
    const sprintName = req.body.name;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    let sprint = { name: sprintName, startDate: new Date(startDate), endDate: new Date(endDate) };

    ModelProject.updateOne({ _id: projectId },
        { $push: { sprints: sprint } }, (succ, err) => {
            if (err) {
                errors.push({ msg: 'Erreur lors de l\'ajout du sprint: ' + err });
            }
        }
    );

    if (errors.length > 0) {
        res.render('/project/:projectId/createSprint', {
            projectId: projectId,
            errors: errors,
            user: req.user
        });
    }
    else {
        res.redirect('/project/' + req.params.projectId);
    }

});

async function getModifySprint(req, res) {
    const projectId = req.params.projectId;
    const sprintId = req.params.sprintId;

    let sprintToUpdate;

    await ModelProject.findOne(
        { 'sprints._id' : sprintId }, 
        { 'sprints.$': 1 }, 
        function(err, project) {
            sprintToUpdate = project.sprints[0];
         }
    );

    res.render('modifySprint', {
        projectId: projectId,
        sprintId: sprintId,
        sprint: sprintToUpdate,
        moment: moment
    });
}

router.get('/project/:projectId/modifySprint/:sprintId', ensureAuthenticated, (req, res) => getModifySprint(req, res));

router.post('/project/:projectId/modifySprint/:sprintId', ensureAuthenticated, (req, res) => {
    const projectId = req.params.projectId;
    const sprintId = req.params.sprintId;
    const newSprintName = req.body.name;
    const newSprintStartDate = req.body.startDate;
    const newSprintEndDate = req.body.endDate;

    ModelProject.updateOne(
        { 'sprints._id' : sprintId },
        { "$set": { "sprints.$.name": newSprintName , "sprints.$.startDate": newSprintStartDate, "sprints.$.endDate":newSprintEndDate } },
        function(err) {
            if (err) {
                console.log("Could not update this sprint: " + err);
            }
        }
    );

    ModelProject.findOne({ _id: projectId }).then(project => {
        ModelUserStory.find({ projectId: projectId })
            .then(userStorys => {
                res.render('project', {
                    project: project,
                    moment: moment,
                    orphanUs: userStorys
                });
            }).catch(err => console.log("Couldn't find this project: " + err));
    })
});

router.get('/project/:projectId/deleteSprint/:sprintId', ensureAuthenticated, (req, res) => {
    const projectId = req.params.projectId;
    const sprintId = req.params.sprintId;

    ModelProject.updateOne(
        { _id: projectId },
        { "$pull": { sprints: { _id : sprintId } } },
        function(err) {
            if (err) {
                console.log("Could not delete this sprint: " + err);
            }
        }
    );

    ModelProject.findOne({ _id: projectId }).then(project => {
        ModelUserStory.find({ projectId: projectId })
            .then(userStorys => {
                res.render('project', {
                    project: project,
                    moment: moment,
                    orphanUs: userStorys
                });
            }).catch(err => console.log("Couldn't find this project: " + err));
    })
});

module.exports = router;