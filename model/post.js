var mongoose = require('mongoose');
var postSchema = mongoose.Schema({
    title: String,
    queryName: String,
    _channel: {type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true},
    url: String,
    text: String,
    user: String,
    score: Number,
    datePosted: Date
});

module.exports = mongoose.model('Post', postSchema);

