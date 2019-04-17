'use strict';
const vrClassroomUtilities = require('../vr-classroom-utilities');
const sanitize = vrClassroomUtilities.sanitize;
const request = require('request');
// const loginController = require('loginController');

function newCourseController() {
    function post(req, res) {
        createNewCourse(req, res);
    }
    return {post};
}

function createNewCourse(req, res){
    req.body.sessionId = req.body.sessionId || req.cookies.sessionId || null;
    req.body.username = req.body.username || req.cookies.username || null;

    request('https://vr-classroom-api.lucaswinther.info/accounts/login',
        {json: req.body, headers: JSON.stringify(req.headers), method: "POST"}, (error, responseFromRequest, body) => {
        console.log("Authenticating User...");
        if (error) {
            console.error(error);
            return -1;
        }
        if (body != null && responseFromRequest.statusCode == 200) {
            console.log("Authentication Successful");
            // Make sure all required information is in the request.
            let courseName = req.body.courseName;
            let courseType = req.body.courseType;
            let courseDescription = req.body.courseDescription;
            let courseTeachers = req.body.courseTeachers;

            if ((courseName != null) && (courseType != null) && (courseDescription != null) && (courseTeachers != null)){
                let courseName = sanitize(req.body.courseName);
                let courseType = sanitize(req.body.courseType);
                let courseDescription = sanitize(req.body.courseDescription);
                let courseTeachers = sanitize(req.body.courseTeachers);

                // send it off!
                request.post('http://vr-classroom-courses.lucaswinther.info/new', {
                    json: {
                        "courseName":courseName,
                        "courseType":courseType,
                        "courseDescription":courseDescription,
                        "courseTeachers":courseTeachers
                    }
                }, (error, responseFromRequest, body) => {
                    if (error) {
                        console.error(error);
                        return -1;
                    }
                    console.log(`statusCode: ${responseFromRequest.statusCode}`);
                    if (body != null) {
                        res.status(responseFromRequest.statusCode);
                        res.set(responseFromRequest.headers);
                        res.send(body);
                    }
                });

            }
            else{
                res.status(400);
                return res.send("name, type, description or teachers were null");
            }
        }
        else{
            res.status(401);
            res.send("Client not authorized to create new course");
        }
    });
}




module.exports = newCourseController;
