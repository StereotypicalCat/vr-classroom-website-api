// Setup mariadb for accounts.
const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: '127.0.0.1',
    port: '3310',
    user: 'root', 
    password: 'AccountPSWD', // change this as production.
    database: 'users',
    connectionLimit: 8
});

async function register(username, password) {
    // defensive code
    if ((typeof (username) != String) || (typeof (password) != String)) {
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
function login(username, password) {
    if ((typeof (username) != String) || (typeof (password) != String)) {
        return "username or password is not string";
    }



}

function makeQuery(queries) {
    if (typeof(queries) != Array){
        throw err;
    }


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

// initializeDatabase();
register("MyUserName", "MyPassWord");