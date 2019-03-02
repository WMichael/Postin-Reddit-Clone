var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var postRoutes = require('./routes/postRoutes');
var userRoutes = require('./routes/userRoutes');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');

// Configuration 
var app = express(); 
var url = 'mongodb://localhost:27017/postin';
mongoose.connect(url, { useNewUrlParser: true});

app.use(morgan('dev'));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));


// Routes 
app.use('/', postRoutes);
app.use('/', userRoutes);

app.get('/', function (req, res) {
    res.redirect('/posts/');
})

mongoose.connection.once('open', () => {
    app.listen( 3001, function() {
        console.log('Server started!');
    });
})