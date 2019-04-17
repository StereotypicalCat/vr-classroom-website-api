const vrClassroomUtilities = require('../vr-classroom-utilities');
const sanitize = vrClassroomUtilities.sanitize;
const request = require('request');

function registerController(db) {
    function post(req, res) {
        let username = sanitize(req.body.username);
        let password = sanitize(req.body.password);
        let email = req.body.email;

        if ((typeof (username) !== "string") || (typeof (password) !== "string")) {
            res.status(400);
            return res.send("username or password not found in request");
        }
        if ((typeof (email) === "string")) {
            email = sanitize(email)
        }

        // Make the request
        // Make the request
        request.post(url = 'http://127.0.0.1:3001/register', {
            json: {
                "username": username,
                "password": password,
                "email":email
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
    return {post};
}


module.exports = registerController;
