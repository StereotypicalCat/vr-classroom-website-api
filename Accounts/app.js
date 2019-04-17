const express = require('express');
const mariadb = require('mariadb');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const db = mariadb.createPool({
    host: '84.238.80.9',
    //host: "127.0.0.1",
    //host: '192.168.99.100',
    port: '3310',
    user: 'root',
    password: 'AccountPSWD', // change this at production.
    database: 'users',
    connectionLimit: 8
});
const port = process.env.PORT || 3001;
const loginRouter = require('./routes/loginRouter')(db);

async function initializeDatabase() {
    let conn;
    try {
        conn = await db.getConnection();
        await conn.query(`CREATE TABLE users ( 
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
            username VARCHAR(18) NOT NULL, 
            password VARCHAR(100) NOT NULL,
            nickname VARCHAR(18),
            email VARCHAR(60), 
            reg_date TIMESTAMP,
            courses VARCHAR(100),
            session_cookies VARCHAR(10000)
            ); `);
    } catch (err) {
        console.log(err);
    } finally {
        if (conn) conn.end();
    }
}

initializeDatabase();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cookieParser());

app.use('/', loginRouter);

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});
