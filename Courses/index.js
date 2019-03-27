// Communication
var express = require('express');
var app = express();

// Setup mariadb for courses.
const mariadb = require('mariadb');

// Parsing
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

async function getCourses(tags) {
    let returnMessage = "Failure or no courses found";

    if(tags == null){
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();


        let query = `SELECT course FROM courses.courses WHERE`;

        Array.prototype.forEach((tag, index) =>{
           if (index !== tags.length){
               query += `tags LIKE %${tag}% AND`
           }
           else{
               query += `tags LIKE %${tag}%`
           }
        });



        let coursesInDatabaseThatMatchesTags = await conn.query(query);

        if (coursesInDatabaseThatMatchesTags.length !== 0){
            return;
        }
        else{
            return coursesInDatabaseThatMatchesTags;
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




const pool = mariadb.createPool({
    host: '192.168.99.100',
    // host: "127.0.0.1",
    port: '3310',
    user: 'root',
    password: 'AccountPSWD', // change this as production.
    database: 'users',
    connectionLimit: 8
});

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

/*initializeDatabase();*/


app.get('/api/courses', jsonParser, function (req, res){
    console.log("REQUEST BODY: " + req.body);

    let promise1 = login(req.body.username, req.body.password);
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
    console.log('server running at http://127.0.0.1:3007')
});






