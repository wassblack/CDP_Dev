const ModelProject = require('../models/project');
const ModelUserStory = require('../models/userStory');
const ModelTest = require('../models/test');
const moment = require('moment');

//Display tests page
function displayTests(req, res) {
    let projectId = req.params.projectId;
    renderTestsPage(res, projectId);
}

//Display create test form
function displayCreateTest(req, res) {
    ModelProject.findOne({ _id: req.params.projectId }).then(project => {
        res.render('createTest', {
            project: project,
            user: req.user
        });
    }).catch(err => console.log(err));
};

// Display modify test
function displayModifyTest(req, res) {
    ModelProject.findOne({ _id: req.params.projectId }).then(project => {
        ModelTest.findOne({ _id: req.params.testId }).then(test => {
            res.render('modifyTest', {
                test: test,
                project: project,
                user: req.user
            });
        }).catch(err => console.log(err));
    });
};

//Modify an existing test
function modifyTest(req, res) {
    const name = req.body.name;
    const description = req.body.description;
    const selectedUsJSON = req.body.selectedUs;
    const userStoryId = JSON.parse(selectedUsJSON);
    const state = req.body.state;
    let errors = [];

    if (!state || !userStoryId || !description || !name) {
        errors.push({ msg: "Champ requis non rempli" });
    }
    if (description.length > 3000) {
        errors.push({ msg: "Description trop longue" });
    }
    ModelTest.updateOne({ _id: req.params.testId }, {
        name: name,
        description: description,
        userStoryId: userStoryId,
        state: state
    }).then(() => {
        renderTestsPage(res, req.params.projectId);
    }).catch(err => console.log(err));
};

//Create a new Test
function createTest(req, res) {
    const selectedUsJSON = req.body.selectedUs;
    const userStory = JSON.parse(selectedUsJSON);
    const name = req.body.name;
    const description = req.body.description;
    const state = req.body.state;
    let errors = [];

    if (!name || !state  || !userStory) {
        errors.push({ msg: "Champ requis non rempli" });
    }
    if (description.length > 3000) {
        errors.push({ msg: "Description trop longue" });
    }

    if (name.length === 0) {
        errors.push({ msg: "Nom du test vide" });
    }

    if (errors.length == 0) {
        const newTest = new ModelTest({
            projectId: req.params.projectId,
            name,
            description,
            userStoryId: userStory,
            state
        });
        newTest.save().then(() => {
            renderTestsPage(res, req.params.projectId);
        }).catch(err => console.log(err));
    } else {
        ModelProject.findOne({ _id: req.params.projectId }).then(project => {
            res.render('createTest', {
                errors,
                project
            });
        });
    }
}

//Delete a test
function deleteTest(req, res) {
    ModelTest.deleteOne({ _id: req.params.testId }).then(() => {
        renderTestsPage(res, req.params.projectId);
    }).catch(err => console.log(err));
}

function renderTestsPage(res, projectId) {
    ModelProject.findOne({ _id: projectId })
        .then(project => {
            ModelTest.find({ projectId: projectId }).then(projectTests => {
                res.render('tests', {
                    project,
                    moment,
                    projectTests
                });
            })
                .catch(err => console.log("Couldn't find tests: " + err));
        })
        .catch(err => console.log("Couldn't find project:" + err));
}


module.exports = {
    displayTests,
    displayCreateTest,
    displayModifyTest,
    modifyTest,
    createTest,
    deleteTest
}