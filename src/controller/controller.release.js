const ModelProject = require('../models/project');

function displayRelease(req, res) {
    const projectId = req.params.projectId;
    ModelProject.findOne({
        _id: projectId
    }).then(project => {
        res.render('releases', {
            project: project
        })
    }).catch(err => console.log(err))
}

module.exports = {
    displayRelease
}
