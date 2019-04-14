String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function newCourseController(db) {
    function post(req, res) {
        newCourse(db, req, res).then(function (value) {
                console.log("Finished request. Funciton returned: " + value)
            }
        );
    }

    return {post};
}

async function newCourse(db, req, res) {


    let conn;

    // Get all the required variables.
    let courseName = req.body.courseName;
    let courseType = req.body.courseType;
    let courseDescription = req.body.courseDescription;
    let courseTeachers = req.body.courseTeachers;

    if ((courseName != null) && (courseType != null) && (courseDescription != null) && (courseTeachers != null)){
        try {
            let courseName = sanitize(courseName);
            let courseType = sanitize(courseType);
            let courseDescription = sanitize(courseDescription);
            let courseTeachers = sanitize(courseTeachers);


            conn = await db.getConnection();

            let usernameTakenTest = await conn.query(`SELECT * FROM \`courses\`.\`courses\` WHERE courseName = "${courseName}";`);

            if (usernameTakenTest.length !== 0){
                res.status(409);
                return res.send("Course name already in use") ;
            }

            conn.query("INSERT INTO `courses`.`courses` (`courseName`, `courseType`, `courseDescription`, `teachers`, `students`, `reg_date`) VALUES (?,?,?,?, NULL, DEFAULT);", [courseName, courseType, courseDescription, courseTeachers]).then(() => {
                return res.sendStatus(201);
            })
        } catch
            (err) {
            throw err;
        } finally {
            if (conn) {
                conn.end();
            }
        }
    }
    else{
        res.status(400);
        return res.send("name, type, description or teachers were null");
    }

}

function sanitize(stringToSanitize){
    stringToSanitize = stringToSanitize.replaceAll("'", `\\'`);
    stringToSanitize = stringToSanitize.replaceAll(`"`, `\\"`);
    return stringToSanitize;
}


module.exports = newCourseController;
