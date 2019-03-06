var Post = require('../model/post.js');

module.exports = (router,passport,isLoggedIn) => {
    require('../config/passport')(passport); // Passport for configuration

    // Routes for users
    // Login
    router.get('/login', (req,res) => {
        res.render('login', {message: req.flash('loginMessage')});
    });

    // Login Post 
    router.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // Sign up 
    router.get('/signup', (req,res) => {
        res.render('signup', {message: req.flash('signupMessage')});
    });

    // Sign up Post 
    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    // Profile 
    // Protected, isLoggedIn is used to verify if user is logged in.
    router.get('/profile', isLoggedIn, (req, res, err) => {
        // Gets user out of session and passes to template.
        Post.find({"user": req.user.username}, (err,result) => {res.render('profile', {posts: result, user : req.user, karma : getKarma(result)})});
        console.log(req.user.username);
    });

    // Logout 
    router.get('/logout', (req,res) => {
        req.logout();
        res.redirect('/');
    });

    // Other functions
    // Function to get the karma of a user. 
    function getKarma(posts) {
        if (posts.length > 1) {
            return posts.reduce((a, b) => a.score + b.score);
        }
        else if(posts.length == 1) {
            return posts[0].score;
        }
        else {
            return 0;
        }
    }
}
