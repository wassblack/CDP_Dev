const mongoose = require('mongoose');

const testSchema = mongoose.Schema({
    projectId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    state: {
        type: String,
        required: true
    },
    userStoryId: {
        type: String,
        required: true
    },

});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;