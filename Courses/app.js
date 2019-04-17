const express = require('express');
const mariadb = require('mariadb');
const bodyParser = require('body-parser');


const app = express();
const db = mariadb.createPool({
    host: '84.238.80.9',
    //host: "127.0.0.1",
    //host: '192.168.99.100',
    port: '3311',
    user: 'root',
    password: 'AccountPSWD', // change this at production.
    database: 'courses',
    connectionLimit: 8
});
const port = process.env.PORT || 3002;
const courseRouter = require('./routes/courseRouter')(db);

async function initializeDatabase() {
    let conn;
    try {
        conn = await db.getConnection();
        await conn.query(`CREATE TABLE courses ( 
            courseId INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
            courseName VARCHAR(60) NOT NULL, 
            courseType VARCHAR(20) NOT NULL,
            courseDescription VARCHAR(500) NOT NULL,
            teachers VARCHAR(30) NOT NULL,
            students VARCHAR(300),
            reg_date TIMESTAMP
            ); `);
    } catch (err) {
        console.log(err);
        console.log("Assuming database is already setup");
    } finally {
        if (conn) conn.end();
    }
}

initializeDatabase();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', courseRouter);

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});
