var mongoose = require('mongoose');
var commentSchema = mongoose.Schema({
    post_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true},
    text: String,
    user: String,
    score: Number,
    datePosted: Date
});

module.exports = mongoose.model('Comment', commentSchema);

