var express = require('express');
var router = express.Router();
var Post = require('../model/post.js');

    // Basic implementation of voting
    router.get('/post/:queryName/up', (req, res) => {
        Post.updateOne({"queryName": req.params.queryName}, {$inc: {"score": 1}}, () => { res.redirect('/posts/')})
    });

    router.get('/post/:queryName/down', (req, res) => {
        Post.updateOne({"queryName": req.params.queryName}, {$inc: {"score": -1}}, () => { res.redirect('/posts/')})
    });


    // Post routes
    router.get('/posts', (req, res) => {
        Post.find({}, (err,result) => {res.render('posts', {posts: result})});
    });

    router.get('/post/:queryName', (req, res) => {
        Post.find({"queryName": req.params.queryName}, (err, result) => {
            res.render('post',{post: result[0], number: 52});
        });
    });

    router.post('/post/delete', (req,res) => {
        Post.deleteOne({"queryName": req.body.queryName}, () => {
            res.redirect('/posts/');
        });
    });

    router.get('/posts/new', (req, res) => {
        res.render('newPost');
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
        Post.find({'queryName': req.params.queryName},(err, result) => {
            if (result.length > 0) {
                console.log(`Post found! ${result}`);
                res.render('editPost', {post: result[0]});
            }
            else {
                console.log('Post not found!');
                res.send('Post does not exist');
            }
        });
    });

    router.post('/post/:queryName/edit', (req, res) => {
        Post.updateOne({'queryName': req.body.queryName},{
            "title": req.body.title,
            "url": req.body.url,
            "text": req.body.text
        },() => res.redirect('/post/' + req.body.queryName));
    });

module.exports = router;