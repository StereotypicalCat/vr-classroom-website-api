const _ = require("lodash");
const request = require('request');

module.exports = function(app){


    app.post('/api/login', function (req, res){
        request.post(url = 'http://127.0.0.1:3008/api/login', {
            json: {
                json: {
                    username: 'lasse',
                    password: 'ES'
                }
            }
        }, (error, res, body) => {
            if (error) {
                console.error(error);
                return
            }
            console.log(`statusCode: ${res.statusCode}`);
            console.log(body)
        })

    }
    )




};