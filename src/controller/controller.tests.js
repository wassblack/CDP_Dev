const ModelProject = require('../models/project');

const validateTestName = function(testName, errors) {
    if (testName) {
        if (testName.length < 5 || testName > 20) {
            errors.push({ msg: 'Le nom de votre test doit être compris entre 5 et 20 caractères.' });
        } else {
            errors.push({ msg: 'Vous devez renseigner un nom pour le test.'});
        }
    }
};

const validateTestDescription = function(testDescription, errors) {
    if (testDescription) {
        if (testDescription.length > 300) {
            errors.push({ msg: 'La description de votre test doit prendre moins de 300 caractères.' });
        }
    } else {
        errors.push({ msg: 'Vous devez renseigner une description pour votre test.' });
    }
};

const validateTestState = function(testState, errors) {
    //TODO: make testState validation function
};

const createTest = function(projectId, test, errors) {
    //TODO : update ModelProject with test creation
}
