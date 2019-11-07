const express = require('express');
const router = express.Router();
const ModelProject = require('../models/project');
const { ensureAuthenticated } = require('../config/authenticated');

router.get('/createProject', ensureAuthenticated, (req, res)  => {
    res.render('createProject');
});

router.post('/createProject', ensureAuthenticated, (req, res)  => {
    const projectName = req.body.name;
    const projectDescription = req.body.description;

    let errors = [];

    if (!projectName) {
        errors.push({ msg: 'Vous devez donner un nom à votre projet' });
    }

    if (projectName.length > 40) {
        errors.push({ msg: 'Le nom de votre projet doit être inférieur à 40 caractères' });
    }

    if (projectDescription && projectDescription.length > 300) {
        errors.push({ msg: 'La description de votre projet doit prendre moins de 300 caractères' });
    }

    if (errors.length == 0) {
        const newProject = new ModelProject({
            name: projectName,
            description: projectDescription,
            users: [{
                email : req.user.email
            }],
            sprints: [],
            releases: []
        });

        newProject.save();
        res.redirect('/project/' + newProject._id);
    }
    else {
        res.render('createProject', {
            errors,
            projectName,
            projectDescription
        });
    }
});

module.exports = router;