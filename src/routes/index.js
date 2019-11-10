const express = require('express');
const ModelProject = require('../models/project');
const router = express.Router();
//Must add to every resource access page
const { ensureAuthenticated } = require('../config/authenticated');

router.get('/', ensureAuthenticated, (req, res) => {
    res.redirect('/Projects');
});
//Passing ensureAthenticated
router.get('/Projects', ensureAuthenticated, (req, res) => {
    var projects;
    ModelProject.find({ 'users.email': req.user.email })
        .then(projects => {
            res.render('index', {
                user: req.user,
                projects: projects
            });
        }).catch(err => console.log(err));


});
module.exports = router;