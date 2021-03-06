/* eslint-disable no-param-reassign */
const express = require('express');
const loginController = require('../controllers/loginController');
const registerController = require('../controllers/registerController');

function routes() {
    const logonRouter = express.Router();
    const logController = loginController();
    const regController = registerController();

    logonRouter.route('/login')
        .post(logController.post);

    logonRouter.route('/register')
        .post(regController.post);

    return logonRouter;
}

module.exports = routes;
