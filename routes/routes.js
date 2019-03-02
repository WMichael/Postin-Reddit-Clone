var express = require('express');
var router = express.Router();
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');

// Required for Passport.js
router.use(session({ 
    secret: 'ilovescotchscotchyscotchscotch', // session secret
    resave: true,
    saveUninitialized: true
})); 

router.use(passport.initialize());
router.use(passport.session()); // Persistent login sessions
router.use(flash()); // use connect-flash for flash messages stored in session

require('./postRoutes')(router,passport,isLoggedIn);
require('./userRoutes')(router,passport,isLoggedIn);  

router.get('/', (req, res) => { res.redirect('/posts/')})

// Seperate functions
function isLoggedIn(req, res, next){
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}

module.exports = router;