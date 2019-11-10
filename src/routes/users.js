const express = require('express');
const router = express.Router();
const ModelUser = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');

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

    else {
        if (password !== password2) {
            errors.push({ msg: 'Votre mot de passe ne correspond pas' });
        }

        if (password.length < 6 || password.length > 40) {
            errors.push({ msg: 'La taille de votre mot de passe doit être comprise entre 6 et 40' });
        }

        if (name.length > 40) {
            errors.push({ msg: 'Votre nom ne peut pas dépasser les 40 caractères' });
        }

        if (firstname.length > 40) {
            errors.push({ msg: 'Votre prénom ne peut pas dépasser les 40 caractères' });
        }

        if (!checkIfEmailInString(email)) {
            errors.push({ msg: 'Votre adresse email n\'est pas conforme' });
        }
    }

    if (errors.length == 0) {
        ModelUser.findOne({ email: email })
            .then(user => {
                if (user) {
                    //user already exists
                    errors.push({ msg: 'Il existe déjà un compte avec cet email' });
                    res.render('register', {
                        errors,
                        name,
                        firstname,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new ModelUser({
                        lastname: name,
                        firstname,
                        email,
                        password
                    });
                    //Encrypt password using bcrypt
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            //new password hashed
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'Votre compte a bien été créé !');
                                    res.redirect('/users/login');

                                })
                                .catch(err => console.log(err));
                        })
                    });
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

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/Projects',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'Vous vous êtes bien déconnecté');
    res.redirect('/users/login');
});

module.exports = router;