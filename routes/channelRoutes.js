var Channel = require('../model/channel.js');

module.exports = (router) => {
    
    // Add a new Channel
    router.get('/channel/new/:channelName', (req,res) => {
        var channel = new Channel({
            "name" : req.params.channelName
        });
        channel.save();
        res.send("Channel saved!");
    }); 
}