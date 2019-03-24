var mongoose = require('mongoose');
var channelSchema = mongoose.Schema({
    name: String
});

module.exports = mongoose.model('Channel', channelSchema);

