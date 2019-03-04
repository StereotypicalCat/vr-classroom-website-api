// Setup mariadb for accounts.
const mariadb = require('mariadb');
const pool = mariadb.createPool({
    // host: '192.168.99.100',
    host: "127.0.0.1",
    port: '3310',
    user: 'root', 
    password: 'AccountPSWD', // change this as production.
    database: 'users',
    connectionLimit: 8
});

async function register(username, password) {
    // defensive code
    if ((typeof (username) !== "string") || (typeof (password) !== "string")) {
        return "username or password is not string";
    }
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("1");
        const res = await conn.query("INSERT INTO `users`.`users` (`username`, `password`, `nickname`, `email`, `reg_date`, `Courses`) VALUES (?,?,?,?, DEFAULT, '');", [username, password, "RossBob", "RossBob@hellothere.com"]);
        console.log("2");        
        console.log(res); // 
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }


}
async function login(username, password) {
    if ((typeof (username) !== "string") || (typeof (password) !== "string")) {
        return "username or password is not string";
    }
    let conn;
    var res = "";
    try {
        conn = await pool.getConnection();
        // console.log("1");
        res = await conn.query(`SELECT username, password FROM users.users WHERE username = "TestUser1";`);
        // console.log("2");
        // console.log(res); //
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
    console.log("--------------------");
    console.log(res);
}

function makeQuery(queries) {


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
            password VARCHAR(26) NOT NULL,
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
        if (conn) return conn.end();
    }
}

// Both of these are working :)
//initializeDatabase();
register("TestUser2", "TestPassword2");
login("TestUser2", "TestPassword2");