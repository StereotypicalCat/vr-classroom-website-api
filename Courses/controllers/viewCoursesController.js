

function viewCoursesController(db) {
    function get(req, res) {
        viewCourses(db, req, res).then(function (value) {
                console.log("Finished request at " + Date.now());
            }
        );
    }

    return {get};
}

async function viewCourses(db, req, res) {
    const amountOfCoursesToSend = 10;
    let courseNameToGet = req.query.courseNameToGet;
    let idToStartAt = parseInt(req.query.idToStartAt);

    let conn;
    try {
        conn = await db.getConnection();
        // If the user is searching for a specific name
        if (courseNameToGet != "null") {
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

        }
        // Else we just give the user a list of some courses from our database. They can supply an id to start at to view courses later in the database
        else {
            let responseFromSql = await conn.query(`SELECT * FROM courses.courses WHERE courseId BETWEEN ${idToStartAt} AND ${idToStartAt + amountOfCoursesToSend};`);
            // If some courses are found.
            if (responseFromSql.length >= 1) {
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
                return res.send("courses with that starting id not found, or no courses in catalogue");
            }
        }

    } catch
        (err) {
        console.log(err);
        console.log("Trying to continue...")
    } finally {
        if (conn) {
            conn.end();
        }
    }
}


module.exports = viewCoursesController;
