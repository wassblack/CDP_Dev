const express = require('express');
const router = express.Router();
const user = require('../models/user');
const bcrypt = require('bcryptjs');

function checkIfEmailInString(text) {
    var re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    return re.test(text);
}

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    const { name, firstname, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !firstname || !email || !password || !password2) {
        errors.push({ msg: 'Champ requis non remplis' });
    }

    if (password !== password2) {
        errors.push({ msg: 'Mot de pass ne correspond pas' });
    }

    if (password.lenght < 6 || password.lenght > 40) {
        errors.push({ msg: 'taille du Mot de pass non conforme' });
    }

    if (name.lenght > 40) {
        errors.push({ msg: 'taille du nom non conforme' });
    }

    if (firstname.lenght > 40) {
        errors.push({ msg: 'taille du prenom non conforme' });
    }

    if (!checkIfEmailInString(email)) {
        errors.push({ msg: 'email non conforme' });
    }
    console.log(errors.values);
    if (errors === undefined || errors.length == 0) {
        user.findOne({ email: email }).then(user => {
            //user already exists
            errors.push({ msg: 'email exist déja' });
            if(user){
                res.render('register', {
                    errors,
                    name,
                    firstname,
                    email,
                    password,
                    password2
                });
            } else{
                const newUser = new User({
                    name,
                    firstname,
                    email,
                    password
                });
                console.log(newUser);
                res.send('Crée');
            }
        });
    } else {
        res.render('register', {
            errors,
            name,
            firstname,
            email,
            password,
            password2
        });

    }
});

module.exports = router;