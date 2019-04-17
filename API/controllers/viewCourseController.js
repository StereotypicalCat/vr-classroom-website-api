const vrClassroomUtilities = require('../vr-classroom-utilities');
const sanitize = vrClassroomUtilities.sanitize;
const http = require('http');
const request = require('request');

String.prototype.replaceAll = function (search, replacement) {
    const target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};


// Guard the other microservices from malicious requests.
function viewCourseController() {
    function get(req, res) {

        // Make sure courseNameToGet isn't undefined, and the string isn't trying sql injections. This isn't perfect list to avoid sql injections but its a start.
        let courseNameToGet = req.query.courseNameToGet || null;

        if(typeof courseNameToGet == 'string'){
            console.log("Sanitinzing Course name");
            courseNameToGet = sanitize(courseNameToGet);
        }

        // Make sure there is an id to start viewing the courses at.
        let idToStartAt = req.query.idToStartAt || 0;
        if (idToStartAt != null){
            // If the id isn't a number, we wont accept it.
            if (typeof idToStartAt != 'number'){
                idToStartAt = null;
            }
            // If the id is a number, we want to make sure it isn't a float...
            else{
                idToStartAt = parseInt(idToStartAt);
            }
        }

        // Make the request
        request.get(url = `http://127.0.0.1:3002/view?courseNameToGet=${courseNameToGet}&idToStartAt=${idToStartAt}`, {
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

    return {get};
}

module.exports = viewCourseController;