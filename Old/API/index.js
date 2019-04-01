var express = require('express');

var app = express();


var microservicessystems = require('./microservicesystems.js')(app);

var server = app.listen(3009, function (){
    console.log('server running at http://127.0.0.1:3009')
});