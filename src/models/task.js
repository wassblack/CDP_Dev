const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    projectId: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    developerId:{
        type: String,
        required: false
    },
    state:{
        type: Number,
        required: true
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;