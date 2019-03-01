var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// User Schema
var userSchema = mongoose.Schema({
    username : String,
    password : String
});

// Methods 
// Generating a Hash
userSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Check if password is valid
userSchema.methods.validPassword = (password) => {
    return bcrypt.compareSync(password, this.password);
};

// Create the model for users and expose to app; 
module.exports = mongoose.model('User', userSchema);