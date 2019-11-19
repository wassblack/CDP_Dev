const express = require('express');
const router = express.Router();
const moment = require('moment');
const ModelProject = require('../models/project');
const ModelUser = require('../models/user');
const ModelUserStory = require('../models/userStory');
const ModelTask = require('../models/task');
const { ensureAuthenticated } = require('../config/authenticated');

// Page displaying the main information about the selected project
router.get('/project/:projectId', ensureAuthenticated, (req, res) => {
    let projectId = req.params.projectId;
    renderProjectPage(res, projectId);
});

// Modify Project
router.get('/project/:projectId/ModifyProject', ensureAuthenticated, (req, res) => {
    ModelProject.findOne({ _id: req.params.projectId }).then(project => {
        res.render('modifyProject', {
            project: project
        });
    }).catch(err => console.log(err));

});
// Modification of the name or description of the selected project
router.post('/project/:projectId', ensureAuthenticated, (req, res) => {
    const projectId = req.params.projectId;
    const newProjectName = req.body.projectName;
    const newProjectDescription = req.body.projectDesc;

    let errors = [];

    if (newProjectName) {
        if (newProjectName.length > 40) {
            errors.push({ msg: 'Le nom de votre projet doit être inférieur à 40 caractères' });
        }
    }
    else {
        errors.push({ msg: 'Vous devez renseigner un nom pour le projet' });
    }

    if (newProjectDescription && newProjectDescription.length > 300) {
        errors.push({ msg: 'La description de votre projet doit prendre moins de 300 caractères' });
    }

    if (errors.length === 0) {
        ModelProject.updateOne({ _id: projectId }, { name: newProjectName, description: newProjectDescription })
            .then(_ => renderProjectPage(res, projectId));
    }
    else {
        ModelProject.findOne({ _id: req.params.projectId }).then(project => {
            res.render('modifyProject', {
                errors,
                project: project
            });
        });
    }
});

router.get('/project/:projectId/delete', ensureAuthenticated, (req, res) => {
    ModelProject.deleteOne({ _id: req.params.projectId }, function () { })
        .then(_ => {
            ModelProject.find({ 'users.email': req.user.email })
                .then(projects => {
                    res.render('index', {
                        user: req.user,
                        projects: projects
                    });
                })
                .catch(err => console.log(err));
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
                // User is registered
                var userToadd = { email: newUser };
                ModelProject.find({ _id: projectId, users: { $elemMatch: { email: newUser } } })
                    .then(project => {
                        // Checking if user already assigned to the project
                        if (project.length > 0) {
                            errors.push({ msg: 'L\'utilisateur est déjà un collaborateur du projet' });
                        } else {
                            ModelProject.updateOne({ _id: projectId },
                                { $push: { users: userToadd } }, (succ, err) => {
                                    if (err) {
                                        errors.push({ msg: 'Ajout non effectué' + err });
                                    }
                                }
                            );
                        }
                    }).catch(err => console.log("Couldn't find the project: " + err));

            } else {
                errors.push({ msg: 'L\'utilisateur n\'existe pas' });
            }
        }).catch(err => console.log("Couldn't find the user: " + err));
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

router.get('/project/:projectId/createTask', ensureAuthenticated, (req, res) => {
    ModelProject.findOne({ _id: req.params.projectId }).then(project => {
        res.render('createTask', {
            project: project,
            user: req.user
        });
    }).catch(err => console.log(err));

});

router.post('/project/:projectId/createTask', ensureAuthenticated, (req, res) => {
    const dev = req.body.developerId;
    const description = req.body.description;
    const state = req.body.state;
    let errors = [];

    if (!dev || !state) {
        errors.push({ msg: "champs requis non remplis" });
    }
    if (state > 3 || state < 1) {
        errors.push({ msg: "valeur non possible" });
    }
    if (description.length > 300) {
        errors.push({ msg: "Description trop longue" });
    }

    if (errors.length == 0) {
        const newTask = new ModelTask({
            projectId: req.params.projectId,
            description,
            developerId: dev,
            state
        });
        newTask.save().then(task => {
            renderProjectPage(res, req.params.projectId);
        }).catch(err => console.log(err));
    } else {
        ModelProject.findOne({ _id: req.params.projectId }).then(project => {
            res.render('createTask', {
                errors,
                project
            });
        })

    }

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
