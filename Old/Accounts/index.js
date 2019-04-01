// Communication
var express = require('express');
var app = express();

// Parsing
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();


// Setup mariadb for accounts.
const mariadb = require('mariadb');


// =========== Hashing ===============

// Hashing algorithm:
const bcrypt = require('bcrypt');
const saltRounds = 10;




const pool = mariadb.createPool({
    host: '192.168.99.100',
    // host: "127.0.0.1",
    port: '3310',
    user: 'root',
    password: 'AccountPSWD', // change this as production.
    database: 'users',
    connectionLimit: 8
});

async function register(username, password) {
    if ((typeof (username) !== "string") || (typeof (password) !== "string")) {
        return "username or password is not string";
    }
    let conn;
    try {
        conn = await pool.getConnection();

        let usernameTakenTest = await conn.query(`SELECT username FROM users.users WHERE username = "${username}";`);

        if (usernameTakenTest.length !== 0){
            console.log("Username is already taken");
            return;
        }


        var hashedPassword = bcrypt.hashSync(password, saltRounds);


        console.log("H Password is: " + hashedPassword);

        await conn.query("INSERT INTO `users`.`users` (`username`, `password`, `nickname`, `email`, `reg_date`, `Courses`) VALUES (?,?,?,?, DEFAULT, '');", [username, hashedPassword, "RossBob", "RossBob@hellothere.com"]);
    } catch (err) {
        throw err;
    } finally {
        if (conn) {
            conn.end();
        }

    }


}

async function login(req, res) {

    var returnMessage = "Failed";
    username = req.body.username;
    password = req.body.password;

    if ((typeof (username) !== "string") || (typeof (password) !== "string")) {
        console.log("USERNAME: " + username);
        console.log("PASSWORD: " + password);
        return "username or password is not string";
    }
    let conn;
    var ressponse = "";
    try {
        conn = await pool.getConnection();
        // console.log("1");
        ressponse = await conn.query(`SELECT username, password FROM users.users WHERE username = "${username}";`);

        if (res.length === 1) {
            var isCorrectPassword = bcrypt.compareSync(password, ressponse[0]["password"]);

            if (isCorrectPassword){
                returnMessage = "Login Successful";
                res.send()
            }
            else{
                returnMessage = "Password not correct";
            }
        }
        else{
            returnMessage = "Username not found";
        }

    } catch (err) {
        throw err;
    } finally {
        if (conn) {
            conn.end();
        }
    }
    return returnMessage;

}


async function initializeDatabase() {
    let conn;
    try {
        console.log("Number 1");
        conn = await pool.getConnection();
        console.log("Number 2");
        const rows = await conn.query(`CREATE TABLE users ( 
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
            username VARCHAR(18) NOT NULL, 
            password VARCHAR(100) NOT NULL,
            nickname VARCHAR(18) NOT NULL,
            email VARCHAR(60), 
            reg_date TIMESTAMP,
            courses VARCHAR(100)
            ); `);
        console.log("Number 3");
        console.log(rows);


    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

// Both of these are working :)
/*initializeDatabase();*/
/*register("lasse", "ES");*/


app.post('/api/login', jsonParser, function (req, res){
    console.log("REQUEST BODY: " + req.body);

    let promise1 = login(req, req);
    promise1.then(function(value){
            res.send(value);
        }
    )
});

app.post('/api/register', jsonParser, function (req, res){
    console.log("REQUEST BODY: " + req.body);

    register(req.body.username, req.body.password).then(function(value){
            res.send(value);
        }
    )
});

var server = app.listen(3008, function (){
    console.log('server running at http://127.0.0.1:3008')
});






