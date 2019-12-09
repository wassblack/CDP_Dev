const moment = require('moment');
const ModelProject = require('../models/project');
const ModelUserStory = require('../models/userStory');
const controllerProject = require('../controller/controller.project');

function checkIfDateInString(text) {
    var re = /[0-9][0-9]\/[0-9][0-9]\/[0-9][0-9]/;
    return re.test(text);
}

//Display create sprint form
function displayCreateSprint(req, res) {
    res.render('createSprint', {
        projectId: req.params.projectId,
        user: req.user
    });
}
//Display edit sprint form
function displayEditSprint(req, res) {
    const projectId = req.params.projectId;
    const sprintId = req.params.sprintId;

    ModelProject.findOne(
        { 'sprints._id': sprintId },
        { 'sprints.$': 1 },
        function (err, project) {
            if (err) {
                console.log("Couldn't find the sprint: " + err)
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
}
//Create a sprint
function createSprint(req, res) {
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

    if (startDate && !checkIfDateInString(startDate)) {
        errors.push({ msg: 'La date de début n\'est pas conforme' });
    }

    if (endDate && !checkIfDateInString(endDate)) {
        errors.push({ msg: 'La date de fin n\'est pas conforme' });
    }

    const startDateSplit = startDate.split('/');
    const endDateSplit = endDate.split('/');

    // Reformat the date in a understandable format
    const reformatStartDate = new Date(startDateSplit[2], startDateSplit[1] - 1, startDateSplit[0]);
    const reformatEndDate = new Date(endDateSplit[2], endDateSplit[1] - 1, endDateSplit[0]);

    if (reformatStartDate > reformatEndDate) {
        errors.push({ msg: 'Votre date de fin doit être postérieure à votre date de début' });
    }

    if (errors.length === 0) {
        let sprint = { name: sprintName, startDate: reformatStartDate, endDate: reformatEndDate };

        ModelProject.updateOne({ _id: projectId },
            { "$push": { sprints: sprint } },
            function (err) {
                if (err) {
                    console.log("Coudn't create the sprint: " + err);
                }
                else {
                    controllerProject.renderProjectPage(res, projectId);
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
}
//Modify an existing sprint
function editSprint(req, res) {
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

    if (newSprintStartDate && !checkIfDateInString(newSprintStartDate)) {
        errors.push({ msg: 'La date de début n\'est pas conforme' });
    }

    if (newSprintEndDate && !checkIfDateInString(newSprintEndDate)) {
        errors.push({ msg: 'La date de fin n\'est pas conforme' });
    }

    const startDateSplit = newSprintStartDate.split('/');
    const endDateSplit = newSprintEndDate.split('/');

    // Reformat the date in a understandable format
    const reformatStartDate = new Date(startDateSplit[2], startDateSplit[1] - 1, startDateSplit[0]);
    const reformatEndDate = new Date(endDateSplit[2], endDateSplit[1] - 1, endDateSplit[0]);

    if (reformatStartDate > reformatEndDate) {
        errors.push({ msg: 'Votre date de fin doit être postérieure à votre date de début' });
    }

    if (errors.length === 0) {
        ModelProject.updateOne(
            { 'sprints._id': sprintId },
            { "$set": { "sprints.$.name": newSprintName, "sprints.$.startDate": reformatStartDate, "sprints.$.endDate": reformatEndDate } },
            function (err) {
                if (err) {
                    console.log("Couldn't update the sprint: " + err)
                }
                else {
                    controllerProject.renderProjectPage(res, projectId);
                }
            }
        );
    }
    else {
        ModelProject.findOne(
            { 'sprints._id': sprintId },
            { 'sprints.$': 1 },
            function (err, project) {
                if (err) {
                    console.log("Couldn't find the sprint: " + err)
                }
                else {
                    res.render('modifySprint', {
                        errors: errors,
                        projectId: projectId,
                        sprintId: sprintId,
                        sprintName: project.sprints[0].name,
                        sprintStartDate: project.sprints[0].startDate,
                        sprintEndDate: project.sprints[0].endDate,
                        moment: moment
                    });
                }
            });
    }
}
//Delete a sprint
function deleteSprint(req, res) {
    const projectId = req.params.projectId;
    const sprintId = req.params.sprintId;

    ModelProject.updateOne(
        { _id: projectId },
        { "$pull": { sprints: { _id: sprintId } } },
        function (err) {
            if (err) {
                console.log("Could not delete this sprint: " + err);
            }
            else {
                controllerProject.renderProjectPage(res, projectId);
            }
        }
    );
}
//Add user story to a sprint
function addUserStory(req, res) {
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
                function () { });
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
                    function () { });
            }
        }

        // Update the database with the added user stories
        ModelProject.updateOne(
            { 'sprints._id': sprintId },
            { "$push": { "sprints.$.userStories": selectedUs } },
            function (err) {
                if (err) {
                    console.log("Couldn't update the sprint: " + err)
                }
                else {
                    controllerProject.renderProjectPage(res, projectId);
                }
            }
        );
    }
    else {
        res.redirect('/project/' + projectId);
    }
}
//Remove a userStory from a sprint
function removeUserStory(req, res) {
    const projectId = req.params.projectId;
    const sprintId = req.params.sprintId;
    const userStoryId = req.params.userStoryId;

    ModelProject.updateOne(
        { 'sprints._id': sprintId },
        { "$pull": { "sprints.$.userStories": { _id: userStoryId } } },
        function (err) {
            if (err) {
                console.log("Could not remove this us from the sprint: " + err);
            }
            else {
                ModelUserStory.updateOne(
                    { '_id': userStoryId },
                    { "$set": { "isOrphan": true, "sprintId": "" } },
                    function (err) {
                        if (err) {
                            console.log("Couldn't update the sprint: " + err)
                        }
                        else {
                            controllerProject.renderProjectPage(res, projectId);
                        }
                    }
                );
            }
        }
    );
}

module.exports = {
    displayCreateSprint,
    displayEditSprint,
    createSprint,
    editSprint,
    deleteSprint,
    addUserStory,
    removeUserStory
}
