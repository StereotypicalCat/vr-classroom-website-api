// Hashing algorithm:
const bcrypt = require('bcrypt');

function logonController(db) {

    function post(req, res) {
        login(db, req, res).then(function(value){
                console.log("Finished request. Funciton returned: " + value)
            }
        );
    }
    return { post };
}

async function login(db, req, res){
    let username = req.body.username;
    let password = req.body.password;

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

            if (isCorrectPassword){
                // "Login Successful";
                // Send cookie and user-id.
                let requestAnswer = JSON.stringify({
                    userID:response[0]["id"],
                    cookie:"Nothing Yet"
                });
                conn.end();
                res.status(200);
                return res.send(requestAnswer);
            }
            else{
                conn.end();
                res.status(400);
                return res.send("Bad password");
            }
        }
        else{
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


module.exports = logonController;
