const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

const port = process.env.PORT || 3000;

const accountsRouter = require('./routes/accountsRouter')();
const courseRouter = require('./routes/courseRouter')();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use(cookieParser());

app.use('/accounts', accountsRouter);
app.use('/courses', courseRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the VR Classroom API');
});

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});
