var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    store: String,
    userId: String,
    guarantee: String,
    receiptURL: String,
    categories: Array,
});

var Product =  mongoose.model("Product", productSchema);

module.exports = Product;
