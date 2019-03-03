// Load all the things we need 
var LocalStrategy = require('passport-local').Strategy;

// Load up the user Model
var User = require('../model/user');

module.exports = (passport) => {

    // Passport session setup 
    // Required for persistent login session
    // Passport needs ability to serialise and unserialise users out of a session

    // Serialise the user for the session
    passport.serializeUser((user,done) => {
        done(null, user.id);
    });

    // Deserialise user
    passport.deserializeUser((id,done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    // Local Login
    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // Allows use to pass back the entire request to the callback
    },
    (req, username, password, done) => {
        // Find a user whoose username is the same as the forms username
        // Check to see if the user trying to login already exists
        
        User.findOne({'username' : username}, (err, user) => {
            if (err) {
                return done(err);
            }

            // If no user is found, return the message
            if (!user) {
                return done(null, false, req.flash('loginMessage', 'No user found.')); //req.flash is the way to set flashdata using connect-flash
            }

            // If user is found but password is wrong
            if (!user.validPassword(password,user.password)) {
                return done(null, false, req.flash('loginMessage', 'Opps! Wrong password.')); // create the loginMessage and save it to session as flashdata
            }

            // If all is well, return successful user
            return done(null, user);
        });
    }
    ));

    // Local Signup
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // Allows use to pass back the entire request to the callback
    },
    (req, username, password, done) => {
        // Asynchronous
        // User.findOne won't fire unless data is sent back
        process.nextTick(() => {
            // Find a user whoose username is the same as the forms username
            // Check if user trying to login already exists
            User.findOne({'username': username}, (err,user) => {
                if (err) {
                    return done(err);
                }

                // Check to see if there is already a user with that username
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // If there is no user with that username
                    // Create User
                    var newUser = new User(); 

                    // Set credentials
                    newUser.username = username;
                    newUser.password = newUser.generateHash(password);
                    newUser.registrationDate = Date.now(); 

                    // Save the user
                    newUser.save((err) => {
                        if(err) {
                            throw err;
                        }
                        console.log(newUser);
                        return done(null, newUser);
                    });
                }
            });
        });
    }
    
    ));
}