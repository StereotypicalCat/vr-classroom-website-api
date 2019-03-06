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

async function login(username, password) {

    var returnMessage = "Failed";

    if ((typeof (username) !== "string") || (typeof (password) !== "string")) {
        return "username or password is not string";
    }
    let conn;
    var res = "";
    try {
        conn = await pool.getConnection();
        // console.log("1");
        res = await conn.query(`SELECT username FROM users.users WHERE username = "${username}";`);

        if (res.length === 1) {
            var correctPassword = bcrypt.compareSync(password, res[0]["password"]);

            if (correctPassword){
                returnMessage = "Login Successful";
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
/*register("lucasw", "winther");*/
/*
var promise1 = Promise.resolve(login("lucas", "winther"));

promise1.then(function(value){
        console.log(value);
    }
);
*/




