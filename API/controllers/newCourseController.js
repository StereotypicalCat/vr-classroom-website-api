const vrClassroomUtilities = require('../vr-classroom-utilities');
const sanitize = vrClassroomUtilities.sanitize;

function newCourseController() {
    function post(req, res) {

        // Make sure the user is logged in.
        let options = {
            host: 'vr-classroom-accounts.lucaswinther.info',
            port: 80,
            path: `/login`,
            method: 'post',
            headers: req.headers,
            cookies: req.cookies,
        };

        let creq = http.request(options, function(cres){
            cres.setEncoding('utf8');
            creq.write(req.body);

            cres.on('data', function(chunk){
                res.write(chunk)
            });

            cres.on('close', () => {
                res.writeHead(cres.statusCode);
                res.send();
            });

            cres.on('end', () => {
                res.writeHead(cres.statusCode);
                res.send();
            }).on('error', (error) => {
                console.log(error);
                res.writeHead(500);
                res.send();
            })
        });
        creq.end();

        // Make sure all required information is in the request.
        if ((courseName != null) && (courseType != null) && (courseDescription != null) && (courseTeachers != null)){
            let courseName = sanitize(req.body.courseName);
            let courseType = sanitize(req.body.courseType);
            let courseDescription = sanitize(req.body.courseDescription);
            let courseTeachers = sanitize(req.body.courseTeachers);



        }
        else{
            res.status(400);
            return res.send("name, type, description or teachers were null");
        }
    }
    return {post};
}

async function newCourse(db, req, res) {



}




module.exports = newCourseController;
