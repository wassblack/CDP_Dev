const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    users: [
        {
            email: {
                type: String,
                required: true
            }
        }
    ],
    sprints: [
        {
            name:{
                type: String,
                required: true
            },
            startDate: Date,
            endDate: Date,
            userStorys: [
                {
                    description: String,
                    defficulty: {
                        type: Number,
                        required: true
                    },
                    priority: {
                        type: Number,
                        required: true
                    },
                    tasks: [
                        {
                            description:{
                                type: String,
                                required: true
                            },
                            deveoloperId:{
                                type: String,
                                required: false
                            },
                            state:{
                                type: Number,
                                required: true
                            }
                        }
                    ]
                }
            ]

        }
    ],
    releases: [
        {
            version:{
                type: String,
                required: true
            },
            description:{
                type: String,
                required: true
            },
            link:{
                type: String,
                required: true
            },
            documentations: [
                {
                    type:{
                        type: String,
                        required: true
                    },
                    link:{
                        type: String,
                        required: true
                    }
                }
            ]

        }
    ]
});

console.log(projectSchema);
const Project = mongoose.model('project', projectSchema);

module.exports = Project;