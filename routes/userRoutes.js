module.exports = (router,passport) => {
    require('../config/passport')(passport); // Passport for configuration

    // Routes for users
    // Login
    router.get('/login', (req,res) => {
        res.render('login', {message: req.flash('loginMessage')});
    });

    // Login Post 
    router.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // Sign up 
    router.get('/signup', (req,res) => {
        res.render('signup', {message: req.flash('signupMessage')});
    });

    // Sign up Post 
    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    // Profile 
    // Protected, isLoggedIn is used to verify if user is logged in.
    router.get('/profile', isLoggedIn, (req, res, err) => {
        res.render('profile', {user: req.user}); // Gets user out of session and passes to template.
        console.log(req.user.username);
    });

    // Logout 
    router.get('/logout', (req,res) => {
        req.logout();
        res.redirect('/');
    });

    // Seperate functions
    function isLoggedIn(req, res, next){
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect('/');
    }

}
