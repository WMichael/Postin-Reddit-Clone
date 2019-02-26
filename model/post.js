var mongoose = require('mongoose');
var postSchema = mongoose.Schema({
    title: String,
    queryName: String,
    url: String,
    text: String,
    user: String,
    score: Number
});

var Post = mongoose.model('Post', postSchema);

// var post = new Post({
//     title: "Hello World!",
//     queryName: "Hello-World!-Michael",
//     url: null, 
//     text: "This is the first post on Postin",
//     user: "Michael",
//     score: 0
// });
// post.save((err,res) => {
//     console.log('Post inserted!', res);
// });

module.exports = Post;

