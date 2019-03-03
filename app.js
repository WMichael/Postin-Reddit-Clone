require('dotenv').load();
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
let routes = require('./routes/routes');

// Configuration 
var app = express(); 
// var url = 'mongodb://localhost:27017/postin';
var url = process.env.MONGODB_URI;
mongoose.connect(url, { useNewUrlParser: true});

app.use(morgan('dev'));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// For Heroku
// If port parameter is set then set port to it otherwise use process.env.PORT 
if (process.argv[2]) {
    app.set('port', process.argv[2]);
    var port = process.argv[2];
}
else {
    app.set('port', process.env.PORT);
    var port = process.env.PORT;
}

app.use(express.static('public'));

// Routes 
app.use('/', routes);

mongoose.connection.once('open', () => {
    app.listen( port, function() {
        console.log('Server started!');
    });
})