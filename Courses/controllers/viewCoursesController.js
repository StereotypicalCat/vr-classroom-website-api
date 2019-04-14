const util = require('util');
const amountOfCoursesToSend = 10;

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function viewCoursesController(db) {
    function get(req, res) {
        viewCourses(db, req, res).then(function (value) {
                console.log("Finished request. Funciton returned: " + value)
            }
        );
    }

    return {get};
}

async function viewCourses(db, req, res) {

    // If the body contains a specific id or name, we want to view that course.

    console.log(req.query);

    let id = req.query.id || null;
    let courseNameToGet = req.query.courseNameToGet || null;

    // If the body contains some id to start at, we start sending them courses from that id.
    let idToStartAt = req.query.idToStartAt || 0;

    let conn;
    try {
        conn = await db.getConnection();

        // If the user is searching for a specific id
        console.log("Is there a course name to get?");
        if (courseNameToGet != null) {
            courseNameToGet = courseNameToGet.replaceAll("'", `\\'`);
            courseNameToGet = courseNameToGet.replaceAll(`"`, `\\"`);
            let responseFromSql = await conn.query(`SELECT * FROM courses.courses WHERE courseName LIKE "%${courseNameToGet}%";`);
            // If the course is found.
            if (responseFromSql.length === 1) {
                res.status(200);
                let response = JSON.stringify({
                    courseName: responseFromSql[0]["courseName"],
                    courseType: responseFromSql[0]["courseType"],
                    courseDescription: responseFromSql[0]["courseDescription"],
                    courseTeachers: responseFromSql[0]["teachers"],
                });
                return res.send(response);
            }
            // Else return not found
            else {
                res.status(404);
                return res.send("course with that name not found");
            }

        } else {
            console.log("Nope. heres what is the body of my request");
            console.log(courseNameToGet);
            if (id != null) {
                let responseFromSql = await conn.query(`SELECT * FROM courses.courses WHERE courseId = ${id};`);
                // If the course is found.
                if (responseFromSql.length === 1) {
                    res.status(200);
                    let response = JSON.stringify({
                        courseName: responseFromSql[0]["courseName"],
                        courseType: responseFromSql[0]["courseType"],
                        courseDescription: responseFromSql[0]["courseDescription"],
                        courseTeachers: responseFromSql[0]["teachers"],
                    });
                    return res.send(response);
                }
                // Else return not found
                else {
                    res.status(404);
                    return res.send("course with that id not found");
                }
            }
            // If the user has already browsed through some courses.
            else {

                let responseFromSql = await conn.query(`SELECT * FROM courses.courses WHERE courseId BETWEEN ${idToStartAt} AND ${idToStartAt + amountOfCoursesToSend};`);
                // If some courses are found.
                if (responseFromSql.length > 0) {
                    let coursesToSendBack = [];
                    let counter = idToStartAt;
                    while ((counter < (idToStartAt + amountOfCoursesToSend)) && (responseFromSql[counter] !== undefined)) {
                        coursesToSendBack.push({
                            courseName: responseFromSql[counter]["courseName"] || null,
                            courseType: responseFromSql[counter]["courseType"] || null,
                            courseDescription: responseFromSql[counter]["courseDescription"] || null,
                            courseTeachers: responseFromSql[counter]["teachers"] || null
                        });
                        counter += 1;
                    }
                    res.status(200);
                    return res.send(JSON.stringify(coursesToSendBack));
                }
                // Else return not found
                else {
                    res.status(404);
                    return res.send("courses with that start id not found");
                }
            }


        }

    } catch
        (err) {
        throw err;
    } finally {
        if (conn) {
            conn.end();
        }
    }
}


module.exports = viewCoursesController;
