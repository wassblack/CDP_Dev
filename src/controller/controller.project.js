const ModelTask = require('../models/task');
const ModelProject = require('../models/project');
const ModelUserStory = require('../models/userStory');
const ModelUser = require('../models/user');
const moment = require('moment');

//Display detail project page
function displayProject(req, res) {
    let projectId = req.params.projectId;
    renderProjectPage(res, projectId);
}
//Display project page
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
//Display modify project page
function displayModifyProject(req,res){
    ModelProject.findOne({ _id: req.params.projectId }).then(project => {
        res.render('modifyProject', {
            project: project
        });
    }).catch(err => console.log(err));
}
//Modify an existing project
function modifyProject(req,res){
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
            .then(() => renderProjectPage(res, projectId));
    }
    else {
        ModelProject.findOne({ _id: req.params.projectId }).then(project => {
            res.render('modifyProject', {
                errors,
                project: project
            });
        });
    }
}
//Delete an existing project
function deleteProject(req,res){
    ModelProject.deleteOne({ _id: req.params.projectId }, function () { })
        .then(() => {
            ModelProject.find({ 'users.email': req.user.email })
                .then(projects => {
                    res.render('index', {
                        user: req.user,
                        projects: projects
                    });
                })
                .catch(err => console.log(err));
        });
}
//Display add user to project page
function displayAddUser(req,res){
    res.render('addUser', {
        projectId: req.params.projectId,
        user: req.user
    });
}
//Add an existing user to an existing project
function addUserToProject(req,res){
    const projectId = req.body.projectId;
    const newUser = req.body.newUser;

    ModelUser.findOne({ email: newUser })
        .then(user => {
            if (user) {
                // User is registered
                var userToadd = { email: newUser };
                ModelProject.findOne({ _id: projectId, users: { $elemMatch: { email: newUser } } })
                    .then(project => {
                        // Checking if user already assigned to the project
                        if (project) {
                            res.render('addUser', {
                                projectId: projectId,
                                errors: [{ msg: 'L\'utilisateur est déjà un collaborateur du projet' }],
                                user: req.user
                            });
                        } else {
                            ModelProject.updateOne({ _id: projectId },
                                { $push: { users: userToadd } }, (err) => {
                                    if (err) {
                                        res.render('addUser', {
                                            projectId: projectId,
                                            errors: [{ msg: 'Une erreur est survenue lors de l\'ajout du collaborateur: ' + err }],
                                            user: req.user
                                        });
                                    }
                                    else {
                                        res.redirect('/');
                                    }
                                }
                            )
                        }
                    }).catch(err => console.log("Couldn't find the project: " + err));

            } else {
                res.render('addUser', {
                    projectId: projectId,
                    errors: [{ msg: 'L\'utilisateur n\'existe pas' }],
                    user: req.user
                });
            }
        }).catch(err => console.log("Couldn't find the user: " + err));
}

module.exports = {
    renderProjectPage,
    displayProject,
    displayModifyProject,
    modifyProject,
    deleteProject,
    displayAddUser,
    addUserToProject
}
