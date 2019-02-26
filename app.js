var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var routes = require('./routes/routes');

var app = express(); 
var url = 'mongodb://localhost:27017/postin';
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

mongoose.connection.once('open', () => {
    app.listen( 3001, function() {
        console.log('Server started!');
    });
})