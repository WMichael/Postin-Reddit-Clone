var Comment = require('../model/comment.js');

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
            res.redirect('/post/' + req.body.postQueryName);
        });
    });

    // Edit Comment
    router.post('/comment/edit', (req, res) => {               
        Comment.updateOne({'_id': req.body.commentId},{
            "text": req.body.editedComment
        },() => res.redirect('/post/' + req.body.postQueryName));
    });
}