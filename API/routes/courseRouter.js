/* eslint-disable no-param-reassign */
const express = require('express');
const newCourseRouter = require('../controllers/newCourseController');
const viewCourseRouter = require('../controllers/viewCourseController');
const joinCourseRouter = require('../controllers/joinCourseController');

function routes() {
    const courseRouter = express.Router();
    const newCourseController = newCourseRouter();
    const viewCourseController = viewCourseRouter();
    const joinCourseController = joinCourseRouter();

    courseRouter.route('/new')
        .post(newCourseController.post);

    courseRouter.route('/view')
        .get(viewCourseController.get);

    courseRouter.route('/join')
        .post(joinCourseController.post);

    return courseRouter;
}

module.exports = routes;
