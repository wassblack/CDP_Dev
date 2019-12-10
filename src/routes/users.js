const express = require('express');
const router = express.Router();
const controllerUser = require('../controller/controller.user');

/**
 * @swagger
 * /register:
 *  get:
 *    description: Page displaying the register form
 *  responses:
 *    200':
 *      description: display success
 */
router.get('/register', controllerUser.displayRegister);

/**
 * @swagger
 * /register:
 *  post:
 *    description: Register a new user
 *  parameters:
 *      - in: formData
 *        name: name
 *        schema:
 *          type: string
 *        description:  Name of the user
 *      - in: formData
 *        name: firstname
 *        schema:
 *          type: string
 *        description:  Firstname of the user
 *      - in: formData
 *        name: email
 *        schema:
 *          type: string
 *        description:  Email of the user
 *      - in: formData
 *        name: password
 *        schema:
 *          type: string
 *        description:  Password of the user
 *      - in: formData
 *        name: password2
 *        schema:
 *          type: string
 *        description:  Password confirmed of the user
 *  responses:
 *    200':
 *      description: success, redirect to the login page
 */
router.post('/register', controllerUser.register);

/**
 * @swagger
 * /login:
 *  get:
 *    description: Page displaying the login page
 *  responses:
 *    200':
 *      description: display success
 */
router.get('/login', controllerUser.displayLogin);

/**
 * @swagger
 * /login:
 *  post:
 *    description: User login
 *  parameters:
 *      - in: formData
 *        name: email
 *        schema:
 *          type: string
 *        description:  Email of the user
 *      - in: formData
 *        name: password
 *        schema:
 *          type: string
 *        description:  Password of the user
 *  responses:
 *    200':
 *      description: success, redirect to the list of projects of the user
 */
router.post('/login', controllerUser.login);

/**
 * @swagger
 * /logout:
 *  get:
 *    description: User logout
 *  responses:
 *    200':
 *      description: success, redirect to the login page
 */
router.get('/logout', controllerUser.logout);


module.exports = router;
