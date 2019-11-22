const express = require('express');
const router = express.Router();
const moment = require('moment');
const ModelProject = require('../models/project');
const ModelUserStory = require('../models/userStory');
const ModelTask = require('../models/task');
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

    if (!sprintName) {
        errors.push({ msg: 'Vous devez donner un nom à votre sprint' });
    }

    else if (sprintName.length > 40) {
        errors.push({ msg: 'Le nom de votre sprint doit être inférieur à 40 caractères' });
    }

    if (!startDate) {
        errors.push({ msg: 'Vous devez donner une date de début à votre sprint' });
    }

    if (!endDate) {
        errors.push({ msg: 'Vous devez donner une date de fin à votre sprint' });
    }

    if (errors.length === 0) {
        let sprint = { name: sprintName, startDate: new Date(startDate), endDate: new Date(endDate) };

        ModelProject.updateOne({ _id: projectId },
            { "$push": { sprints: sprint } },
            function(err) {
                if (err) {
                    console.log("Coudn't create the sprint: " + err);
                }
                else {
                    renderProjectPage(res, projectId);
                }
            }
        );
    }
    else {
        res.render('createSprint', {
            errors: errors,
            projectId: projectId
        });
    }
});

router.get('/project/:projectId/modifySprint/:sprintId', ensureAuthenticated, (req, res) => {
    const projectId = req.params.projectId;
    const sprintId = req.params.sprintId;

    ModelProject.findOne(
        { 'sprints._id' : sprintId },
        { 'sprints.$': 1 },
        function(err, project) {
            if (err) {
                console.log("Couldn't find the sprint: "+ err)
            }
            else {
                res.render('modifySprint', {
                    projectId: projectId,
                    sprintId: sprintId,
                    sprintName: project.sprints[0].name,
                    sprintStartDate: project.sprints[0].startDate,
                    sprintEndDate: project.sprints[0].endDate,
                    moment: moment
                });
            }
        });
});

router.post('/project/:projectId/modifySprint/:sprintId', ensureAuthenticated, (req, res) => {
    const errors = [];
    const projectId = req.params.projectId;
    const sprintId = req.params.sprintId;
    const newSprintName = req.body.name;
    const newSprintStartDate = req.body.startDate;
    const newSprintEndDate = req.body.endDate;

    if (!newSprintName) {
        errors.push({ msg: 'Vous devez donner un nom à votre sprint' });
    }

    else if (newSprintName.length > 40) {
        errors.push({ msg: 'Le nom de votre sprint doit être inférieur à 40 caractères' });
    }

    if (!newSprintStartDate) {
        errors.push({ msg: 'Vous devez donner une date de début à votre sprint' });
    }

    if (!newSprintEndDate) {
        errors.push({ msg: 'Vous devez donner une date de fin à votre sprint' });
    }

    if (errors.length === 0) {
        ModelProject.updateOne(
            { 'sprints._id' : sprintId },
            { "$set": { "sprints.$.name": newSprintName , "sprints.$.startDate": newSprintStartDate, "sprints.$.endDate":newSprintEndDate } },
            function(err) {
                if (err) {
                    console.log("Couldn't update the sprint: "+ err)
                }
                else {
                    renderProjectPage(res, projectId);
                }
            }
        );
    }
    else {
        res.render('modifySprint', {
            errors: errors,
            projectId: projectId,
            sprintId: sprintId,
            sprintName: newSprintName,
            sprintStartDate: new Date(newSprintStartDate),
            sprintEndDate: new Date(newSprintEndDate),
            moment: moment
        });
    }
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
            else {
                renderProjectPage(res, projectId);
            }
        }
    );
});

router.post('/project/:projectId/addUs/:sprintId', ensureAuthenticated, (req, res) => {
    const projectId = req.params.projectId;
    const sprintId = req.params.sprintId;
    const selectedUsJSON = req.body.selectedUs;

    // Translate the US in JSON format into objects and add them into the list of US that will be added in the sprint
    let selectedUs;

    if (selectedUsJSON !== undefined) {
        // If the user selected only one user story
        if (!Array.isArray(selectedUsJSON)) {
            selectedUs = JSON.parse(selectedUsJSON);

            // Set the orphan user story's parent (this sprint)
            ModelUserStory.updateOne({ _id: selectedUs._id },
                                     { isOrphan: false, sprintId: sprintId },
                                     function() {});
        }
        // Else ...
        else if (selectedUsJSON.length > 1) {
            selectedUs = []
            for (let i = 0; i < selectedUsJSON.length; i++) {
                const us = JSON.parse(selectedUsJSON[i]);
                selectedUs.push(us);

                // Set the orphan user story's parent (this sprint)
                ModelUserStory.updateOne({ _id: us._id },
                                         { isOrphan: false, sprintId: sprintId },
                                         function() {});
            }
        }

        // Update the database with the added user stories
        ModelProject.updateOne(
            { 'sprints._id' : sprintId },
            { "$push": { "sprints.$.userStories": selectedUs } },
            function(err) {
                if (err) {
                    console.log("Couldn't update the sprint: " + err)
                }
                else {
                    renderProjectPage(res, projectId);
                }
            }
        );
    }
    else {
        res.redirect('/project/' + projectId);
    }
});

router.get('/project/:projectId/removeUs/:sprintId/:userStoryId', ensureAuthenticated, (req, res) => {
    const projectId = req.params.projectId;
    const sprintId = req.params.sprintId;
    const userStoryId = req.params.userStoryId;

    ModelProject.updateOne(
        { 'sprints._id' : sprintId },
        { "$pull": { "sprints.$.userStories": { _id : userStoryId } } },
        function(err) {
            if (err) {
                console.log("Could not remove this us from the sprint: " + err);
            }
            else {
                ModelUserStory.updateOne(
                    { '_id' : userStoryId },
                    { "$set": { "isOrphan": true , "sprintId": "" } },
                    function(err) {
                        if (err) {
                            console.log("Couldn't update the sprint: "+ err)
                        }
                        else {
                            renderProjectPage(res, projectId);
                        }
                    }
                );
            }
        }
    );
});

router.get('/project/:projectId/editUserStory/:sprintId/:userStoryId', ensureAuthenticated, (req, res) => {
    const projectId = req.params.projectId;
    const sprintId = req.params.sprintId;
    const userStoryId = req.params.userStoryId;

    ModelUserStory.findOne({ _id: userStoryId })
        .then(userStory => {
            res.render('modifyUserStory', {
                projectId: projectId,
                userStory: userStory,
                sprintId : sprintId
            });
        })
        .catch(err => console.log("Couldn't find this user story: " + err));
});

router.post('/project/:projectId/editUserStory/:sprintId/:userStoryId', ensureAuthenticated, (req, res) => {
    const projectId = req.params.projectId;
    const sprintId = req.params.sprintId;
    const userStory = JSON.parse(req.body.userStory);
    const newUserStoryDescription = req.body.description;
    const newUserStoryDifficulty = req.body.difficulty;
    const newUserStoryPriority = req.body.priority;
    const userStoryId = userStory._id;
    let errors = [];

    if (newUserStoryDescription) {
        if (newUserStoryDescription.length > 300) {
            errors.push({ msg: 'La description de votre user story doit prendre moins de 300 caracteres.' });
        }
    }
    else {
        errors.push({ msg: 'Vous devez renseigner une description pour la user story' });
    }

    if (newUserStoryDifficulty) {
        if (newUserStoryDifficulty <= 0 || newUserStoryDifficulty > 10) {
            errors.push({ msg: 'La difficulté doit être specifiée' });
        }
    }
    else {
        errors.push({ msg: 'Vous devez renseigner une difficulté pour la user story' });
    }

    if (newUserStoryPriority) {
        if (newUserStoryPriority <= 0 || newUserStoryPriority > 3) {
            errors.push({ msg: 'La priorité doit être comprise entre 1 et 3' });
        }
    }
    else {
        errors.push({ msg: 'Vous devez renseigner une priorité pour la user story' });
    }

    if (errors.length === 0) {

        // Pull the outdated us
        ModelProject.updateOne(
            { 'sprints._id' : sprintId },
            { "$pull": { "sprints.$.userStories": { _id : userStoryId } } },
            function(err) {
                if (err) {
                    console.log("Could not remove this us from the sprint: " + err);
                }
                else {
                    userStory.description = newUserStoryDescription;
                    userStory.difficulty = newUserStoryDifficulty;
                    userStory.priority = newUserStoryPriority;

                    // Push the updated us
                    ModelProject.updateOne(
                        { 'sprints._id' : sprintId },
                        { "$push": { "sprints.$.userStories": userStory } },
                        function(err) {
                            if (err) {
                                console.log("Couldn't update the sprint: " + err)
                            }
                            else {
                                // Update the us in the backlog
                                ModelUserStory.updateOne({ _id: userStoryId },
                                    { description: newUserStoryDescription, difficulty: newUserStoryDifficulty, priority: newUserStoryPriority })
                                    .then(_ => renderProjectPage(res, projectId));
                            }
                        }
                    );
                }
            }
        );
    }
    else {
        res.render('modifyUserStory', {
            errors: errors,
            projectId: projectId,
            userStory: userStory,
            sprintId : sprintId
        });
    } 
});

function renderProjectPage(res, projectId)
{
    let noOrphanUs = false;

    ModelUserStory.countDocuments({projectId : projectId, isOrphan : true})
        .then(numberOfOrphanUs => {
            noOrphanUs = (numberOfOrphanUs === 0);
        });

    ModelProject.findOne({ _id: projectId })
        .then(project => {
            ModelUserStory.find({ projectId: projectId })
                .then(userStorys => {
                    ModelTask.find({ projectId: projectId }).then(task => {
                        res.render('project', {
                            project: project,
                            moment: moment,
                            orphanUs: userStorys,
                            tasks: task,
                            noOrphanUs: noOrphanUs
                        });
                    })

                })
                .catch(err => console.log("Couldn't find orphan user stories: " + err));
        })
        .catch(err => console.log("Couldn't find user stories: " + err));
}

module.exports = router;
