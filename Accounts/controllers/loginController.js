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

    let userSessionCookie = req.cookies.sessionId;
    // console.log("COOKIES: " + req.cookies.sessionId);

    if (userSessionCookie != null || userSessionCookie != undefined) {
        if (typeof (username) !== "string") {
            res.status(400);
            return res.send("Username not found in request");
        }
        let conn;
        try {
            conn     = await db.getConnection();
            let response = await conn.query(`SELECT session_cookies FROM users.users WHERE username = "${username}";`);


            if (response.length === 1) {
                let sessionCookiesInDBUnparsed = response[0]["session_cookies"].split('|');
                let sessionCookiesInDB = [];

                sessionCookiesInDBUnparsed.forEach(cookie => {
                    sessionCookiesInDB.push(JSON.parse(cookie));
                });

                console.log(Object.entries(sessionCookiesInDB));

                let foundCookie = false;
                let counter = 0;
                let userIdAndInfo = await conn.query(`SELECT id, username, password FROM users.users WHERE username = "${username}";`);

                sessionCookiesInDB.forEach(cookie => {
                    counter += 1;

                    if (cookie.cookie == userSessionCookie) {
                        foundCookie = true;

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
                            return res.send("Cookie is too old, please relog");
                        } else {
                            let requestAnswer = JSON.stringify({
                                userID: userIdAndInfo[0]["id"],
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
        if ((typeof (username) !== "string") || (typeof (password) !== "string")) {
            console.log("USERNAME: " + username);
            console.log("PASSWORD: " + password);
            res.status(400);
            return res.send("Username or Password not found in request");
        }
        let conn;
        try {
            conn = await db.getConnection();
            let response = await conn.query(`SELECT id, username, password FROM users.users WHERE username = "${username}";`);

            if (response.length === 1) {
                var isCorrectPassword = bcrypt.compareSync(password, response[0]["password"]);

                if (isCorrectPassword) {
                    // "Login Successful";
                    // Send cookie and user-id.

                    let currentCookiesInDB = await conn.query(`SELECT session_cookies from users.users WHERE username = "${username}";`);

                    let loginCookie = uuidv4();
                    let requestAnswer = JSON.stringify({
                        userID: response[0]["id"],
                    });

                    if (currentCookiesInDB[0]["session_cookies"] == "") {
                        conn.query(`UPDATE users.users SET session_cookies = (?) WHERE username = "${username}";`, [JSON.stringify({
                            cookie: loginCookie,
                            expirationDate: new Date(Date.now() + timeCookiesLast)
                        })]).then(() => {
                            conn.end();
                        });
                    } else {
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
