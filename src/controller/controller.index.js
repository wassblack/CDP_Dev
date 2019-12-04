const ModelProject = require('../models/project');

function redirectToIndex(req, res) {
    res.redirect('/Projects');
}

function displayIndex(req, res) {
    ModelProject.find({ 'users.email': req.user.email })
        .then(projects => {
            res.render('index', {
                user: req.user,
                projects: projects
            });
        }).catch(err => console.log(err));
}

module.exports = {
    redirectToIndex,
    displayIndex,
}
