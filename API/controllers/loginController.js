const vrClassroomUtilities = require('../vr-classroom-utilities');
const sanitize = vrClassroomUtilities.sanitize;
const request = require('request');

function logonController() {
    function post(req, res) {
        let username = req.body.username || req.cookies.username || null;
        let password = req.body.password;
        let userSessionCookie = req.cookies.sessionId || req.body.sessionId;

        // If the username isn't supplied in the request.
        if (typeof (username) !== "string") {
            res.status(400);
            return res.send("Username not found in request");
        }
        // If neither password nor cookie is supplied in the request.
        else if (typeof (password) !== "string" && (userSessionCookie == null || userSessionCookie == undefined)){
            res.status(400);
            return res.send("Either no password were supplied, or no cookie not found in request");
        }
        else {
            // sanitize user input
            username = sanitize(username);
            console.log(password);
            password = sanitize(password);

            // Make the request
            request.post(url = 'https://vr-classroom-accounts.lucaswinther.info/login', {
                json: {
                    "username": username,
                    "password": password,
                    "sessionId":userSessionCookie
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
    }
    return {post};
}


module.exports = logonController;
