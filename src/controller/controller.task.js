const ModelTask = require('../models/task');
const ModelProject = require('../models/project');
const ModelUserStory = require('../models/userStory');
const moment = require('moment');

//Display create task form
function displayCreateTask(req, res) {
    ModelProject.findOne({ _id: req.params.projectId }).then(project => {
        res.render('createTask', {
            project: project,
            user: req.user
        });
    }).catch(err => console.log(err));
}

// Display modify task
function displayModifyTask(req, res) {
    ModelProject.findOne({ _id: req.params.projectId }).then(project => {
        ModelTask.findOne({ _id: req.params.taskId }).then(task => {
            res.render('modifyTask', {
                task: task,
                project: project,
                user: req.user
            });
        }).catch(err => console.log(err));
    })
}

//Modify an existing task
function modifyTask(req, res) {
    const description = req.body.description;
    const developerId = req.body.developerId;
    const state = req.body.state;
    let errors = [];

    if (!state || !description || !developerId) {
        errors.push({ msg: "Champ requis non remplis" })
    }
    if (state > 3 || state < 1) {
        errors.push({ msg: "valeur non possible" });
    }
    if (description.length > 3000) {
        errors.push({ msg: "Description trop longue" });
    }
    ModelTask.updateOne({ _id: req.params.taskId }, {
        description: description,
        developerId: developerId,
        state: state
    }).then(() => {
        renderProjectPage(res, req.params.projectId);
    }).catch(err => console.log(err));
}

//Create a new Task
function createTask(req, res) {
    const dev = req.body.developerId;
    const description = req.body.description;
    const state = req.body.state;
    let errors = [];

    if (!description || !dev || !state) {
        errors.push({ msg: "champs requis non remplis" });
    }
    if (state > 3 || state < 1) {
        errors.push({ msg: "valeur non possible" });
    }
    if (description.length > 3000) {
        errors.push({ msg: "Description trop longue" });
    }

    if (errors.length == 0) {
        const newTask = new ModelTask({
            projectId: req.params.projectId,
            description,
            developerId: dev,
            state
        });
        newTask.save().then(() => {
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

}

//Delete an existing task
function deleteTask(req, res) {
    ModelTask.deleteOne({ _id: req.params.taskId }).then(() => {
        renderProjectPage(res, req.params.projectId);
    }).catch(err => console.log(err));
}

function linkTask(req, res) {
    const projectId = req.params.projectId;
    const taskId = req.params.taskId;
    const selectedUsJSON = req.body.selectedUs;

    // Translate the US in JSON format into objects and add them into the list of US that will be added in the sprint
    let selectedUs;

    if (selectedUsJSON !== undefined) {
        // If the user selected only one user story
        if (!Array.isArray(selectedUsJSON)) {
            selectedUs = JSON.parse(selectedUsJSON);
            const selectedUsId = selectedUs._id;

            // Get the selected us's sprint id
            ModelUserStory.findOne({ _id: selectedUsId }).then(us => {
                const sprintId = us.sprintId;

                ModelTask.findOne({ _id: taskId }).then(task => {
                    selectedUs.tasks.push(task);
      
                    ModelProject.updateOne(
                        { 'sprints._id' : sprintId },
                        { "$pull": { "sprints.$.userStories": { _id: selectedUsId } } },
                        function (err) {
                            if (err) {
                                console.log("Couldn't update the sprint: " + err)
                            }
                            else {
                                ModelProject.updateOne(
                                    { 'sprints._id' : sprintId },
                                    { "$push": { "sprints.$.userStories": selectedUs } },
                                    function (err) {
                                        if (err) {
                                            console.log("Couldn't update the sprint: " + err)
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
            })
            .catch(err => console.log(err));
        }

        // Else ...
        else if (selectedUsJSON.length > 1) {
            selectedUs = [];
            let myTask;
            ModelTask.findOne({ _id: taskId }).then(task => {
                myTask = task;
            });
            for (let i = 0; i < selectedUsJSON.length; i++) {
                const us = JSON.parse(selectedUsJSON[i]);
                us.tasks.push(myTask);
                selectedUs.push(us);
            }
            // Update the database with the added user stories
            ModelProject.updateOne(
                {
                    '_id': projectId,
                    sprints: { $elemMatch: { "userStories._id": selectedUs.id } }
                },
                { "$push": { "sprints.$.userStories": selectedUs } },
                function (err) {
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
    }
}

function unlinkTask(req, res) {
    const projectId = req.params.projectId;
    const sprintId = req.params.sprintId;
    const taskId = req.params.taskId;
    const userStoryId = req.params.userStoryId;

    let unlinkedUserstory = JSON.parse(req.body.linkedUserstory);

    const taskIndex = unlinkedUserstory.tasks.findIndex(t => t._id === taskId);
    if (taskIndex !== undefined) unlinkedUserstory.tasks.splice(taskIndex, 1);

    ModelProject.updateOne(
        { 'sprints._id' : sprintId },
        { "$pull": { "sprints.$.userStories": { _id: userStoryId } } },
        function (err) {
            if (err) {
                console.log("Couldn't update the sprint: " + err)
            }
            else {
                ModelProject.updateOne(
                    { 'sprints._id' : sprintId },
                    { "$push": { "sprints.$.userStories": unlinkedUserstory } },
                    function (err) {
                        if (err) {
                            console.log("Couldn't update the sprint: " + err)
                        }
                        else {
                            renderProjectPage(res, projectId);
                        }
                    }
                );
            }
        }
    );
}

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


module.exports = {
    displayCreateTask,
    displayModifyTask,
    modifyTask,
    createTask,
    deleteTask,
    linkTask,
    unlinkTask
}
