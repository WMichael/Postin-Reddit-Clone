var Post = require('../model/post.js');
var User = require('../model/user.js');
var Comment = require('../model/comment.js');
var Channel = require('../model/channel.js');

module.exports = (router,passport,isLoggedIn,checkIfCanVote) => {
    //Implementation of voting
    router.get('/post/:queryName/up/:prevPath', checkIfCanVote, (req, res) => {
        let scoreChange = 1; // If post is currently downvoted then the upvote will increment score by 2 else it will be by 1.

        // Checks whether post is found in postsUpVoted, if found then it removes the up vote and decreases post's score.
        if (req.user.postsUpVoted.includes(req.params.queryName)) {
            User.updateOne({username : req.user.username},{"$pull":{"postsUpVoted": req.params.queryName}}).exec((err, raw) =>{
                Post.updateOne({"queryName": req.params.queryName}, {$inc: {"score": -1}}, () => {
                        // Redirect to same path but remove up from the path name. 
                        (req.params.prevPath == "post") ?res.redirect("/post/" + req.params.queryName) : res.redirect("/");
                });
            });
            
        } else {
            // Add post to user postsUpVoted array
            User.updateOne({username : req.user.username},{"$push":{"postsUpVoted": req.params.queryName}}).exec((err, raw) =>{
            });
            
            // If in postsDownVoted, remove it and add 2 to score
            if(req.user.postsDownVoted.includes(req.params.queryName)) {
                User.updateOne({username : req.user.username},{"$pull":{"postsDownVoted": req.params.queryName}}).exec((err, raw) =>{    
                });
                scoreChange = 2;
            } 
            
            // Increments the post's score and redirects user to the path it was on
            Post.updateOne({"queryName": req.params.queryName}, {$inc: {"score": scoreChange}}, () => {
                (req.params.prevPath == "post") ?res.redirect("/post/" + req.params.queryName) : res.redirect("/");});
        }
    
    });

    router.get('/post/:queryName/down/:prevPath', checkIfCanVote, (req, res) => {
        let scoreChange = -1;

            if (req.user.postsDownVoted.includes(req.params.queryName)) { 
                User.updateOne({username : req.user.username},{"$pull":{"postsDownVoted": req.params.queryName}}).exec((err, raw) =>{
                    Post.updateOne({"queryName": req.params.queryName}, {$inc: {"score": 1}}, () => {
                         // Redirect to same path but remove up from the path name. 
                         (req.params.prevPath == "post") ?res.redirect("/post/" + req.params.queryName) : res.redirect("/");
                    });
                });            
            } else {
                User.updateOne({username : req.user.username},{"$push":{"postsDownVoted": req.params.queryName}}).exec((err, raw) =>{
                });

                if(req.user.postsUpVoted.includes(req.params.queryName)) {
                    User.updateOne({username : req.user.username},{"$pull":{"postsUpVoted": req.params.queryName}}).exec((err, raw) =>{
                    });
                    scoreChange = -2;
                }
                Post.updateOne({"queryName": req.params.queryName}, {$inc: {"score": scoreChange}}, () => {
                    (req.params.prevPath == "post") ? res.redirect("/post/" + req.params.queryName) : res.redirect("/");})
            }
    });

    // Post routes
    router.get('/', (req, res) => {
        Post.find({}).populate("_channel").exec((err,result) => {res.render('posts', {
            message: req.flash('message'), posts: result.sort((a,b) => {return b.score - a.score}), user : req.user, 
        })});
    });

    router.get('/post/:queryName', (req, res) => {
        Post.find({"queryName": req.params.queryName}).populate("_channel").exec((err,result) => {
            // Find comments with correct post_id and pass to render.
            Comment.find({"post_id" : result[0].id}, (err, comments) => {
                res.render('post',{post: result[0], user : req.user, comments : comments});
            });
        });
    });

    router.post('/post/delete', (req,res) => {
        Post.deleteOne({"queryName": req.body.queryName}, () => {
            res.redirect('/');
        });
    });

    router.get('/posts/new', isLoggedIn, (req, res) => {
        Channel.find({}, (err, channels) => {
            res.render('newPost',{user : req.user, channels : channels });
        });
    });

    router.post('/posts/new', (req, res) => {
        var queryName = req.body.title.replace(/ /g, '-');
        var post = new Post({
            "title": req.body.title,
            "queryName": queryName,
            "_channel": req.body.channel_id,
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

    