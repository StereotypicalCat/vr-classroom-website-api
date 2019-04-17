// Hashing algorithm:
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const util = require('util');


// time cookies last in milliseconds
const timeCookiesLast = 30000;


function logonController(db) {

    function post(req, res) {
        login(db, req, res).then(function (value) {
                console.log("Finished request. Funciton returned: " + value)
            }
        );
    }

    return {post};
}

async function login(db, req, res) {
    let username = req.body.username;
    let password = req.body.password;

    let userSessionCookie = req.body.sessionId;

    // If there is a cookie supplied, we try to log ind with that.
    if (userSessionCookie != null || userSessionCookie != undefined) {
        let conn;
        try {
            conn = await db.getConnection();
            let response = await conn.query(`SELECT session_cookies FROM users.users WHERE username = "${username}";`);

            // If there were any cookies found for the user
            if (response.length === 1) {
                // Cookies in the database are seperated by |
                let sessionCookiesInDBUnparsed = response[0]["session_cookies"].split('|');
                let sessionCookiesInDB = [];

                sessionCookiesInDBUnparsed.forEach(cookie => {
                    sessionCookiesInDB.push(JSON.parse(cookie));
                });


                let userIdAndInfo = await conn.query(`SELECT id, username, password FROM users.users WHERE username = "${username}";`);
                let foundCookie = false;
                let counter = 0;
                sessionCookiesInDB.forEach(cookie => {
                    counter += 1;
                    // If the cookie supplied by the user is the same as a cookie in the database
                    if (cookie.cookie == userSessionCookie) {
                        foundCookie = true;
                        // If the cookie is too old.
                        if (Date.parse(cookie.expirationDate) < Date.now()) {
                            console.log("Cookie is too old, and should be removed");
                            sessionCookiesInDB.splice(counter - 1, 1);
                            let newCookiesInDB = "";
                            sessionCookiesInDB.forEach(cookieInDb => {
                                newCookiesInDB += "|" + JSON.stringify(cookieInDb);
                            });
                            // Remove the first element from the new cookies.
                            newCookiesInDB = newCookiesInDB.substring(1, newCookiesInDB.length);
                            conn.query(`UPDATE users.users SET session_cookies = '${newCookiesInDB}' WHERE username = '${username}';`).then(() => {
                                conn.end();
                            });

                            res.status(401);
                            res.clearCookie("sessionId");
                            return res.send("Cookie is too old, please login again.");
                        }
                        // If the cookie hasn't expired yet.
                        else {
                            let requestAnswer = JSON.stringify({
                                userID: userIdAndInfo[0]["id"],
                                userCookie:cookie.cookie
                            });

                            res.status(200);
                            return res.send(requestAnswer);
                        }
                    }
                });
                if (!foundCookie) {
                    res.status(400);
                    res.clearCookie("sessionId");
                    return res.send("Cookie to that username not found");
                }

            } else {
                res.status(500);
                return res.send("Duplicate username found")
            }


        } catch (e) {
            throw e;
        } finally {
            conn.end();
        }
    } else {
        let conn;
        try {
            conn = await db.getConnection();
            let response = await conn.query(`SELECT id, username, password FROM users.users WHERE username = "${username}";`);

            if (response.length === 1) {
                let isCorrectPassword = bcrypt.compareSync(password, response[0]["password"]);

                if (isCorrectPassword) {
                    // Login Successful;
                    // Send cookie and user-id.


                    let loginCookie = uuidv4();
                    let requestAnswer = JSON.stringify({
                        userID: response[0]["id"],
                        cookie:loginCookie
                    });

                    let currentCookiesInDB = await conn.query(`SELECT session_cookies from users.users WHERE username = "${username}";`);
                    // Put the new cookie in the database

                    // If the user currently does not have any cookies in the database
                    if (currentCookiesInDB[0]["session_cookies"] == "") {
                        conn.query(`UPDATE users.users SET session_cookies = (?) WHERE username = "${username}";`, [JSON.stringify({
                            cookie: loginCookie,
                            expirationDate: new Date(Date.now() + timeCookiesLast)
                        })]).then(() => {
                            conn.end();
                        });
                    }
                    // If the user does already have some cookies in the database
                    else {
                        conn.query(`UPDATE users.users SET session_cookies = (?) WHERE username = "${username}";`, currentCookiesInDB[0]["session_cookies"] + "|" + [JSON.stringify({
                            cookie: loginCookie,
                            expirationDate: new Date(Date.now() + timeCookiesLast)
                        })]).then(() => {
                            conn.end();
                        });
                    }
                    res.status(200);
                    res.cookie('sessionId', loginCookie, {expires: new Date(Date.now() + timeCookiesLast)});
                    return res.send(requestAnswer);
                } else {
                    conn.end();
                    res.status(400);
                    return res.send("Bad password");
                }
            } else {
                conn.end();
                res.status(404);
                return res.send("Username not found");
            }

        } catch (err) {
            throw err;
        } finally {
            if (conn) {
                conn.end();
            }
        }
    }
}


module.exports = logonController;
