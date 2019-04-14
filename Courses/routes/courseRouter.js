/* eslint-disable no-param-reassign */
const express = require('express');
const newCourseController = require('../controllers/newCourseController');
const viewCoursesController = require('../controllers/viewCoursesController');

function routes(db) {
    const coursesRouter = express.Router();
    const newController = newCourseController(db);
    const viewController = viewCoursesController(db);

    coursesRouter.route('/new')
        .post(newController.post);

    coursesRouter.route('/view')
        .get(viewController.get);

    return coursesRouter;
}

module.exports = routes;
