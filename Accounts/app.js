const express = require('express');
const mariadb = require('mariadb');
const bodyParser = require('body-parser');


const app = express();
const db = mariadb.createPool({
    //host: '192.168.99.100',
    host: "127.0.0.1",
    port: '3310',
    user: 'root',
    password: 'AccountPSWD', // change this as production.
    database: 'users',
    connectionLimit: 8
});
const port = process.env.PORT || 3000;
const loginRouter = require('./routes/loginRouter')(db);

async function initializeDatabase() {
    let conn;
    try {
        conn = await pool.getConnection();
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
        console.log(err);
    } finally {
        if (conn) conn.end();
    }
}

initializeDatabase();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/login', loginRouter);

app.get('/', (req, res) => {
    res.send('Welcome to my Nodemon API!');
});

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});
