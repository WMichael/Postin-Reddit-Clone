var Post = require('../model/post.js');
var User = require('../model/user.js');

module.exports = (router,passport,isLoggedIn,checkIfCanVote) => {
    //Implementation of voting
    router.get('/post/:queryName/up/:prevPath', checkIfCanVote, (req, res) => {
        // Looks for user in DB
        User.find({username : req.user.username}, (err, result) => {
            // Checks whether post is found in postsUpVoted, if that's true then it means the user can't upvote it again.
            if (result[0].postsUpVoted.includes(req.params.queryName)) { 
                // Redirect to same path but remove up from the path name. 
                (req.params.prevPath == "post") ?res.redirect("/post/" + req.params.queryName) : res.redirect("/");
            }
            else {
                 // Add post to uesr postsUpVoted array
                User.updateOne({username : req.user.username},{"$push":{"postsUpVoted": req.params.queryName}}).exec((err, raw) =>{
                    if (err) return handleError(err);
                });
                // If in postsDownVoted, remove it
                User.updateOne({username : req.user.username},{"$pull":{"postsDownVoted": req.params.queryName}}).exec((err, raw) =>{
                    if (err) return handleError(err);
                });
                // Increments the post's score and redirects user to the path it was on
                Post.updateOne({"queryName": req.params.queryName}, {$inc: {"score": 1}}, () => {
                    (req.params.prevPath == "post") ?res.redirect("/post/" + req.params.queryName) : res.redirect("/");});
            }
        });
    });

    router.get('/post/:queryName/down/:prevPath', checkIfCanVote, (req, res) => {
        User.find({username : req.user.username}, (err, result) => {
            if (result[0].postsDownVoted.includes(req.params.queryName)) { 
                (req.params.prevPath == "post") ? res.redirect("/post/" + req.params.queryName) : res.redirect("/");
            }
            else {
                User.updateOne({username : req.user.username},{"$push":{"postsDownVoted": req.params.queryName}}).exec((err, raw) =>{
                    if (err) return handleError(err);
                });
                User.updateOne({username : req.user.username},{"$pull":{"postsUpVoted": req.params.queryName}}).exec((err, raw) =>{
                    if (err) return handleError(err);
                });
                Post.updateOne({"queryName": req.params.queryName}, {$inc: {"score": -1}}, () => {
                    (req.params.prevPath == "post") ? res.redirect("/post/" + req.params.queryName) : res.redirect("/");})
            }
        });
    });

    // Post routes
    router.get('/', (req, res) => {
        Post.find({}, (err,result) => {res.render('posts', {message: req.flash('message'), posts: result.sort((a,b) => {return b.score - a.score}), user : req.user})});
    });

    router.get('/post/:queryName', (req, res) => {
        Post.find({"queryName": req.params.queryName}, (err, result) => {
            res.render('post',{post: result[0], user : req.user});
        });
    });

    router.post('/post/delete', (req,res) => {
        Post.deleteOne({"queryName": req.body.queryName}, () => {
            res.redirect('/');
        });
    });

    router.get('/posts/new', isLoggedIn, (req, res) => {
        res.render('newPost',{user : req.user});
    });

    router.post('/posts/new', (req, res) => {
        var queryName = req.body.title.replace(/ /g, '-');
        var post = new Post({
            "title": req.body.title,
            "queryName": queryName,
            "url": req.body.url,
            "text": req.body.text,
            "user": req.body.user,
            "datePosted" : Date.now(),
            "score": 0
        });
        post.save((err,result) => {
            console.log("Post inserted!");
            res.redirect('/post/' + queryName);
        });
    })

    router.get('/post/:queryName/edit', (req, res) => {
        if (typeof req.user == 'undefined') {
            res.redirect('/');
        } else {
            Post.find({'queryName': req.params.queryName,  "user" : req.user.username},(err, result) => {
                if (result.length > 0) {
                    console.log(`Post found! ${result}`);
                    res.render('editPost', {post: result[0], user: req.user});
                }
                else {
                    console.log('Post not found!');
                    res.send('Post does not exist');
                }
             });
        }
    });

    router.post('/post/:queryName/edit', (req, res) => {
        Post.updateOne({'queryName': req.body.queryName},{
            "title": req.body.title,
            "url": req.body.url,
            "text": req.body.text
        },() => res.redirect('/post/' + req.body.queryName));
    });

}

    