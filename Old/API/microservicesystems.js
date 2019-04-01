const _ = require("lodash");
const request = require('request');

// Parsing
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

const login = (username, password) => {
    return new Promise((resolve, reject) => {
        request.post(url = 'http://127.0.0.1:3008/api/login', {
            json: {
                "username": username,
                "password": password
            }

        }, (error, res, body) => {
            if (error) {
                console.error(error);
                return
            }
            console.log(`statusCode: ${res.statusCode}`);
            console.log(body);
            if (body != null) {
                resolve(body);
            } else {
                reject(Error("It broke"));
            }
        });
    })
};

const register = (username, password) => {
    return new Promise((resolve, reject) => {
        request.post(url = 'http://127.0.0.1:3008/api/register', {
            json: {
                "username": username,
                "password": password
            }

        }, (error, res, body) => {
            if (error) {
                console.error(error);
                return
            }
            console.log(`statusCode: ${res.statusCode}`);
            console.log(body);
            if (body != null) {
                resolve(body);
            } else {
                reject(Error("It broke"));
            }
        })
    })
};


module.exports = function (app) {


    app.post('/api/login', jsonParser, function (req, res) {

            if (req.body.username && req.body.password) {
                login(req.body.username, req.body.password).then(answer => {
                    if (answer === "Login Successful"){
                        res.cookie('MyCookieTest=ThisIsMyValue');
                    }
                    res.send(answer)
                    }
                )
            }
        }
    );

    app.post('/api/register', jsonParser, function (req, res) {

            if (req.body.username && req.body.password) {
                register(req.body.username, req.body.password).then(answer => (
                    res.send(answer))
                )
            }
        }
    );
};