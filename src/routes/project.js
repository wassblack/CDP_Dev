const express = require('express');
const router = express.Router();
const ModelProject = require('../models/project');
const ModelUser = require('../models/user');
const ModelUserStory = require('../models/userStory');
const { ensureAuthenticated } = require('../config/authenticated');

// Page displaying the main information about the selected project
router.get('/project/:projectId', ensureAuthenticated, (req, res) => {
    req.session.projectId = req.params.projectId;
    let projectId = req.params.projectId;

    ModelProject.findOne({ _id: projectId })
        .then(
            project => {
                if (req.session.project !== undefined && project.id !== req.session.project.id) {
                    req.session.project = project;
                }
                req.session.projectName = project.name;
                req.session.projectDesc = project.description;
                ModelUserStory.find({ projectId: projectId })
                    .then(userStories => {
                        res.render('project', {
                            project: project,
                            orphanUs: userStories
                        });
                    }).catch(err => console.log("Couldn't find this project: " + err));
            }
        )
        .catch(err => console.log("Couldn't find this project: " + err));
});

// Modify Project
router.get('/project/:projectId/ModifyProject', ensureAuthenticated, (req, res) => {
    ModelProject.findOne({_id: req.params.projectId}).then(project=>{
        res.render('modifyProject', {
            project: project
        });
    }).catch(err => console.log(err));
    
});
// Modification of the name or description of the selected project
router.post('/project/:projectId', ensureAuthenticated, (req, res) => {
    const newProjectName = req.body.projectName;
    const newProjectDescription = req.body.projectDesc;

    let errors = [];

    if (newProjectName) {
        if (newProjectName.length > 40) {
            errors.push({ msg: 'Le nom de votre projet doit être inférieur à 40 caractères' });
        }

        else {
            ModelProject.updateOne({ _id: req.session.projectId }, {
                name: newProjectName,
                description: newProjectDescription

            }, function () { });

            req.session.projectName = newProjectName
        }
    }

    else if (newProjectDescription) {
        if (newProjectDescription.length > 300) {
            errors.push({ msg: 'La description de votre projet doit prendre moins de 300 caractères' });
        }
        else {
            ModelProject.updateOne({ _id: req.session.projectId }, {
                description: newProjectDescription
            }, function () { });

            req.session.projectDesc = newProjectDescription
        }
    }

    else {
        console.log("An error occured when modifying the project attributes")
    }

    if (errors.length == 0) {

        ModelUserStory.find({ projectId: req.params.projectId }).then(userStories => {
            ModelProject.findOne({_id: req.params.projectId}).then(project=>{
                res.render('project', {
                    project: project,
                    orphanUs: userStories
                });
            });
            
        }).catch(err => console.log(err));
    }
    else {
        ModelProject.findOne({_id: req.params.projectId}).then(project=>{
            res.render('project', {
                errors,
                project: project
            });
        });
        
    }

});

router.get('/project/:projectId/delete', ensureAuthenticated, (req, res) => {
    ModelProject.deleteOne({ _id: req.params.projectId }, function () { });
    res.render('index', {
        user: req.user,
    });
});

router.get('/project/:projectId/addUser', ensureAuthenticated, (req, res) => {
    res.render('addUser', {
        projectId: req.params.projectId,
        user: req.user
    });
});

router.post('/project/:projectId/addUser', ensureAuthenticated, (req, res) => {
    const projectId = req.body.projectId;
    const newUser = req.body.newUser;
    const errors = [];

    ModelUser.findOne({ email: newUser })
        .then(user => {
            if (user) {
                //User is registred 
                var userToadd = { email: newUser };
                ModelProject.find({ _id: projectId, users: { $elemMatch: { email: newUser } } })
                    .then(project => {
                        //Checking if user already assigned to the project
                        if (project.length > 0) {
                            errors.push({ msg: 'l\'utilisateur est deja un collaborateurs du projet' });
                        } else {
                            ModelProject.updateOne({ _id: projectId },
                                { $push: { users: userToadd } }, (succ, err) => {
                                    if (err) {
                                        errors.push({ msg: 'Ajout non effectuer' + err });
                                    }
                                }
                            );
                        }
                    }).catch(err => errors.push({ msg: err }));

            } else {
                errors.push({ msg: 'l\'utilisateur n\'existe pas' });
            }
        }).catch(err => errors.push({ msg: err }));
    if (errors.length > 0) {
        res.render('/project/:projectId/addUser', {
            projectId: projectId,
            errors: errors,
            user: req.user
        });
    } else {
        res.redirect('/');
    }

});

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

module.exports = router;