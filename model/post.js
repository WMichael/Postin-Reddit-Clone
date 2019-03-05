var mongoose = require('mongoose');
var postSchema = mongoose.Schema({
    title: String,
    queryName: String,
    url: String,
    text: String,
    user: String,
    score: Number,
    datePosted: Date
});

module.exports = mongoose.model('Post', postSchema);

