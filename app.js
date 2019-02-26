var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var routes = require('./routes/routes');

var app = express(); 
var url = 'mongodb://localhost:27017/postin';
var db = mongoose.connection; 
mongoose.connect(url, { useNewUrlParser: true});

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/', routes);

app.get('/', function (req, res) {
    res.send('Server is up and running!');
})

db.once('open', () => {
    app.listen( 3001, function() {
        console.log('Server started!');
    });
})