const _ = require("lodash");
const request = require('request');

// Parsing
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

module.exports = function(app){


    app.post('/api/login', jsonParser, function (req, res){

        let apiAnswer;

    if (req.body.username && req.body.password) {

        request.post(url = 'http://127.0.0.1:3008/api/login', {
            json:{
                "username":req.body.username,
                "password":req.body.password
            }

        }, (error, res, body) => {
            if (error) {
                console.error(error);
                return
            }
            console.log(`statusCode: ${res.statusCode}`);
            console.log(body);
            apiAnswer = body;
        })
    }


        res.send(apiAnswer);

    }
    )




};