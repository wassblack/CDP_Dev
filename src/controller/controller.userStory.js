const ModelProject = require('../models/project');
const ModelUserStory = require('../models/userStory');

const validateUserStoryDescription = function(userStoryDescription, errors) {
    if (userStoryDescription) {
        if (userStoryDescription.length > 300) {
            errors.push({ msg: 'La description de votre user story doit prendre moins de 300 caracteres.' });
        }
    } else {
        errors.push({ msg: 'Vous devez renseigner une description pour la user story' });
    }
};

const validateUserStoryDifficulty =  function(userStoryDifficulty, errors) {
    if (userStoryDifficulty) {
        if (userStoryDifficulty <= 0 || userStoryDifficulty > 10) {
            errors.push({ msg: 'La difficulté doit être specifiée' });
        }
    } else {
        errors.push({ msg: 'Vous devez renseigner une difficulté pour la user story' });
    }
};

const validateUserStoryPriority =  function(userStoryPriority, errors) {
    if (userStoryPriority) {
        if (userStoryPriority <= 0 || userStoryPriority > 3) {
            errors.push({ msg: 'La priorité doit être comprise entre 1 et 3' });
        }
    } else {
        errors.push({ msg: 'Vous devez renseigner une priorité pour cette user story' });
    }
};

const getOrphanUserStories =  function(projectId) {
    let orphanUs = ModelUserStory.find({ projectId: projectId });
    return orphanUs;
};

module.exports = {
    validateUserStoryDescription,
    validateUserStoryDifficulty,
    validateUserStoryPriority,
    getOrphanUserStories
};