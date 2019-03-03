var Post = require('../model/post.js');

module.exports = (router,passport,isLoggedIn,checkIfCanVote) => {
    // Basic implementation of voting
    router.get('/post/:queryName/up', checkIfCanVote, (req, res) => {
        Post.updateOne({"queryName": req.params.queryName}, {$inc: {"score": 1}}, () => {
            res.redirect('/')})
    });

    router.get('/post/:queryName/down', checkIfCanVote, (req, res) => {
        Post.updateOne({"queryName": req.params.queryName}, {$inc: {"score": -1}}, () => {
            res.redirect('/')})
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

    