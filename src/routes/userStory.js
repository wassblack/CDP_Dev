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
        res.redirect('/project/'+projectId);
    } else {
        res.render('createUserStory', {
            projectId: projectId,
            errors: errors
        });
    }
});

module.exports = router;

