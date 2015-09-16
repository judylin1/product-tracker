var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    url: String,
    userId: String,
    guarantee: String,
    categories: Array,
});

var Product =  mongoose.model("Product", productSchema);

module.exports = Product;
