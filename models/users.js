var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    name: String,
    password: String,
    purchases: Array,
    products: Array,
});

var User =  mongoose.model("User", userSchema);

module.exports = User;
