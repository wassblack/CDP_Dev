const express = require('express');
const router = express.Router();
const controllerUser = require('../controller/controller.user');

router.get('/register', controllerUser.displayRegister);

router.post('/register', controllerUser.register);

router.get('/login', controllerUser.displayLogin);

router.post('/login', controllerUser.login);

router.get('/logout', controllerUser.logout);


module.exports = router;
