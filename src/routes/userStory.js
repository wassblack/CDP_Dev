const express = require('express');
const router = express.Router();
const moment = require('moment');
const ModelProject = require('../models/project');
const ModelUserStory = require('../models/userStory');
const ModelTask = require('../models/task');
const { ensureAuthenticated } = require('../config/authenticated');

router.get('/project/:projectId/createUserStory', ensureAuthenticated, (req, res) => {
    res.render('createUserStory', {
        projectId: req.params.projectId
    });
});

router.post('/project/:projectId/createUserStory', ensureAuthenticated, (req, res) => {
    const userStoryDescription = req.body.description;
    const userStoryDifficulty = req.body.difficulty;
    const userStoryPriority = req.body.priority;
    const projectId = req.params.projectId;

    let errors = [];
    if (!projectId) {
        errors.push({ msg: 'L\'id du projet n\'est pas définie' });
    }

    if (userStoryDescription && userStoryDescription.length > 300) {
        errors.push({ msg: 'La description de votre user story doit prendre moins de 300 caracteres.' });
    }

    if (!userStoryDifficulty || userStoryDifficulty <= 0) {
        errors.push({ msg: 'La difficulté doit être spécifiée' });
    }

    if (!userStoryPriority) {
        errors.push({ msg: 'La priorité doit être spécifiée' });
    }

    if (errors.length == 0) {
        const newUserStory = new ModelUserStory({
            projectId: projectId,
            description: userStoryDescription,
            difficulty: parseInt(userStoryDifficulty, 10),
            priority: parseInt(userStoryPriority, 10),
            isOrphan: true
        });
        newUserStory.save().then(_ => renderProjectPage(res, projectId));
    } else {
        res.render('createUserStory', {
            projectId: projectId,
            errors: errors
        });
    }
});

router.get('/project/:projectId/editUserStory/:userStoryId', ensureAuthenticated, (req, res) => {
    const projectId = req.params.projectId;
    const userStoryId = req.params.userStoryId;

    ModelUserStory.findOne({ _id: userStoryId })
        .then(userStory => {
            res.render('modifyUserStory', {
                projectId: projectId,
                userStory: userStory,
                sprintId : userStory.sprintId
            });
        })
        .catch(err => console.log("Couldn't find this user story: " + err));
});

router.post('/project/:projectId/editUserStory', ensureAuthenticated, (req, res) => {
    const projectId = req.params.projectId;
    const newUserStoryDescription = req.body.description;
    const newUserStoryDifficulty = req.body.difficulty;
    const newUserStoryPriority = req.body.priority;
    const newUserStoryId = req.body.userStoryId;
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
        ModelUserStory.updateOne({ _id: newUserStoryId }, {
            description: newUserStoryDescription
            , difficulty: newUserStoryDifficulty, priority: newUserStoryPriority
        })
            .then(_ => renderProjectPage(res, projectId));
    }
    else {
        res.render('modifyUserStory', {
            errors: errors,
            projectId: projectId,
            userStoryId: newUserStoryId
        });
    }
});

router.get('/project/:projectId/deleteUserStory/:userStoryId/:sprintId', ensureAuthenticated, (req, res) => {
    const projectId = req.params.projectId;
    const userStoryId = req.params.userStoryId;
    const sprintId = req.params.sprintId;

    // Delete the us from the backlog
    ModelUserStory.deleteOne({ _id: userStoryId }, function () { })
        .then(_ => {
            if (sprintId !== "0") {
                // Remove the us from its sprint if it has one
                ModelProject.updateOne(
                    { 'sprints._id' : sprintId },
                    { "$pull": { "sprints.$.userStories": { _id : userStoryId } } },
                    function(err) {
                        if (err) {
                            console.log("Could not remove this us from the sprint: " + err);
                        }
                        else {
                            renderProjectPage(res, projectId)
                        }
                    }
                );
            }
            else {
                renderProjectPage(res, projectId)
            }
    });
});

function renderProjectPage(res, projectId) {
    let noOrphanUs = false;

    ModelUserStory.countDocuments({ projectId: projectId, isOrphan: true })
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

