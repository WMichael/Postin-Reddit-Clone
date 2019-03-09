var Comment = require('../model/comment.js');
var Post = require('../model/post.js');
var User = require('../model/user.js');

module.exports = (router) => {
    
    // Add Comment
    router.post('/comment/add', (req,res) => {
        var comment = new Comment({
            post_id : req.body.post_id,
            text : req.body.comment_text,
            user : req.body.user,
            score : 0,
            datePosted : Date.now()
        });
        console.log(req.body.postQueryName);
        
        comment.save((err,result) => {
            console.log("Comment inserted!");
            res.redirect('/post/' + req.body.postQueryName);
        });
    });

    // Delete Comment 
    router.post('/comment/delete', (req,res) => {
        console.log("Deleted");
        Comment.deleteOne({"_id": req.body.commentId}, () => {
            console.log("Deleted");
            res.redirect('/');
        });
    });
}