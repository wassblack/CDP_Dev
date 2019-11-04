const express = require('express');
const router = express.Router();
//Must add to every resource access page
const { ensureAuthenticated } = require('../config/authenticated');

router.get('/', (req, res) => {
    res.render('Projects');
});
//Passing ensureAthenticated
router.get('/Projects',ensureAuthenticated, (req, res) => {
    res.render('Projects', {
        user: req.user
    });
});
module.exports = router;