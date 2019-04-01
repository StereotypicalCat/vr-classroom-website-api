// Hashing algorithm:
const bcrypt = require('bcrypt');
const saltRounds = 10;

function registerController(db) {
    function post(req, res) {
        register(db, req, res).then(function(value){
            console.log("Finished request. Funciton returned: " + value)
            }
        );
    }
    return { post };
}

async function register(db, req, res) {

    let username = req.body.username;
    let password = req.body.password;

    if ((typeof (username) !== "string") || (typeof (password) !== "string")) {
        res.status(400);
        return res.send("username or password not found in request");
    }
    let conn;
    try {
        conn = await db.getConnection();

        let usernameTakenTest = await conn.query(`SELECT username FROM users.users WHERE username = "${username}";`);

        if (usernameTakenTest.length !== 0){
            res.status(409);
            return res.send("Username already taken") ;
        }

        let hashedPassword = bcrypt.hashSync(password, saltRounds);

        conn.query("INSERT INTO `users`.`users` (`username`, `password`, `nickname`, `email`, `reg_date`, `Courses`) VALUES (?,?,?,?, DEFAULT, '');", [username, hashedPassword, "RossBob", "RossBob@hellothere.com"]).then(() => {
            return res.sendStatus(201);
        })


    } catch (err) {
        throw err;
    } finally {
        if (conn) {
            conn.end();
        }

    }
}


module.exports = registerController;
