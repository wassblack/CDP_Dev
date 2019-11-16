const express = require('express');
const router = express.Router();
const ModelProject = require('../models/project');
const ModelUserStory = require('../models/userStory');
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
        errors.push({ msg: 'L\'id du project nest pas definie' });
    }

    if (userStoryDescription && userStoryDescription.length > 300) {
        errors.push({ msg: 'La description de votre User Story doit prendre moins de 300 caracteres.' });
    }

    if (!userStoryDifficulty || userStoryDifficulty <= 0) {
        errors.push({ msg: 'La difficulte doit etre specifiee' });
    }

    if (!userStoryPriority) {
        errors.push({ msg: 'La priorite doit etre specifiee' });
    }

    if (errors.length == 0) {
        const newUserStory = new ModelUserStory({
            projectId: projectId,
            description: userStoryDescription,
            difficulty: parseInt(userStoryDifficulty, 10),
            priority: parseInt(userStoryPriority, 10)
        });
        newUserStory.save();
        res.redirect('/project/' + projectId);
    } else {
        res.render('createUserStory', {
            projectId: projectId,
            errors: errors
        });
    }
});

router.post('/project/:projectId/editUserStory', ensureAuthenticated, (req, res) => {
    const newUserStoryDescription = req.body.description;
    const newUserStoryDifficulty = req.body.difficulty;
    const newUserStoryPriority = req.body.priority;
    const projectId = req.params.projectId;

    let errors = [];

    if (newUserStoryDescription) {
        if (newUserStoryDescription.length > 300) {
            errors.push({ msg: 'La description de votre User Story doit prendre moins de 300 caracteres.' });
        }
        else {
            ModelUserStory.updateOne({ _id: req.body.userStoryId }, {
                description: newUserStoryDescription
            }, function () { });
        }
    }

    else if (newUserStoryDifficulty) {
        if (newUserStoryDifficulty <= 0 || newUserStoryDifficulty > 10) {
            errors.push({ msg: 'La difficulte doit etre specifiee' });
        }
        else {
            ModelUserStory.updateOne({ _id: req.body.userStoryId }, {
                difficulty: newUserStoryDifficulty
            }, function () { });
        }
    }

    else if (newUserStoryPriority) {
        if (newUserStoryPriority <= 0 || newUserStoryPriority > 3) {
            errors.push({ msg: 'la priorité doit être comprise entre 1 et 3' });
        }
        else {
            ModelUserStory.updateOne({ _id: req.body.userStoryId }, {
                priority: newUserStoryPriority
            }, function () { });
        }
    }

    else {
        console.log("An error occured when modifying the User Story attributes");
    }

    if (errors.length == 0) {
        res.redirect('/project/' + projectId);
    }
    else {
        res.render('modifyUserStory', {
            projectId: req.params.projectId,
            userStory: req.params.userStoryId,
            errors: errors
        });
    }
});


router.get('/project/:projectId/editUserStory/:userStoryId', ensureAuthenticated, (req, res) => {
    ModelUserStory.findOne({ _id: req.params.userStoryId })
        .then(userStory => {
            res.render('modifyUserStory', {
                projectId: req.params.projectId,
                userStoryId: req.params.userStoryId,
                userStory: userStory
            });
        })
        .catch(err => console.log("Couldn't find this user story: " + err));
});

router.get('/project/:projectId/deleteUserStory/:userStoryId', ensureAuthenticated, (req, res) => {
    const projectId = req.params.projectId;
    ModelUserStory.deleteOne({ _id: req.params.userStoryId }, function () { });
    ModelProject.findOne({ _id: projectId }).then(project => {
        ModelUserStory.find({ projectId: projectId })
            .then(userStorys => {
                res.render('project', {
                    project: project,
                    orphanUs: userStorys
                });
            }).catch(err => console.log("Couldn't find this project: " + err));
    })
});

module.exports = router;

