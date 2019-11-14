const mongoose = require('mongoose');

const userStorySchema = mongoose.Schema({
    projectId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: Number,
        required: true
    },
    priority: {
        type: Number,
        required: true
    }
});

const UserStory = mongoose.model('UserStory', userStorySchema);

module.exports = UserStory;