const express = require('express');
const router = express.Router();
const ModelProject = require('../models/project');
const { ensureAuthenticated } = require('../config/authenticated');

// Page displaying the main information about the selected project
router.get('/project/:projectId', ensureAuthenticated, (req, res)  => displayProjectPage(req, res));

async function displayProjectPage(req, res)
{
    req.session.projectId = require('mongodb').ObjectID(req.params.projectId);

    await ModelProject.findOne({_id: req.session.projectId})
        .then(
            project => {
                req.session.projectName = project.name;
                req.session.projectDesc = project.description;
            }
        )
        .catch(err => console.log("Couldn't find this project: " + err));

    res.render('project', { 
        projectId : req.session.projectId,
        projectName : req.session.projectName,
        projectDesc : req.session.projectDesc 
    });
}

// Modification of the name or description of the selected project
router.post('/project/:projectId', ensureAuthenticated, (req, res)  => {
    const newProjectName = req.body.projectName;
    const newProjectDescription = req.body.projectDescription;

    let errors = [];

    if (newProjectName) {
        if (newProjectName.length > 40) {
            errors.push({ msg: 'Le nom de votre projet doit être inférieur à 40 caractères' });
        }

        else {
            ModelProject.updateOne({_id: req.session.projectId}, {
                name: newProjectName
            }, function() {});
        
            req.session.projectName = newProjectName
        }
    }

    else if (newProjectDescription) {
        if (newProjectDescription.length > 300) {
            errors.push({ msg: 'La description de votre projet doit prendre moins de 300 caractères' });
        }
        else {
            ModelProject.updateOne({_id: req.session.projectId}, {
                description: newProjectDescription
            }, function() {});
        
            req.session.projectDesc = newProjectDescription
        }
    }

    else {
        console.log("An error occured when modifying the project attributes")
    }

    if (errors.length == 0) {
        res.render('project', { 
            projectId : req.session.projectId,
            projectName : req.session.projectName,
            projectDesc : req.session.projectDesc 
        });
    }
    else {
        res.render('project', {
            errors,
            projectId : req.session.projectId,
            projectName : req.session.projectName,
            projectDesc : req.session.projectDesc 
        });
    }
    
});

// Click on the edit button next to the project name
router.get('/project/:projectId/modifyName', ensureAuthenticated, (req, res)  => {
    res.render('modifyProjectName', { 
        projectId : req.session.projectId,
        projectName : req.session.projectName,
        projectDesc : req.session.projectDesc 
    });
});

// Click on the "modify" button
router.get('/project/:projectId/modifyDescription', ensureAuthenticated, (req, res)  => {
    res.render('modifyProjectDescription', { 
        projectId : req.session.projectId,
        projectName : req.session.projectName,
        projectDesc : req.session.projectDesc 
    });
});

router.get('/project/:projectId/delete', ensureAuthenticated, (req, res)  => {
    ModelProject.deleteOne({_id: req.session.projectId}, function() {});
    res.redirect('/Projects');
});

module.exports = router;