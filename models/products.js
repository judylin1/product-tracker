var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name: String,
    serial: String,
    price: Number,
    purchase_date: String,
    exp_date: String,
    exp_on: String,
    store: String,
    phone: String,
    userId: String,
    guarantee: String,
    receiptURL: String,
    productImg: String,
    categories: Array,
});

var Product =  mongoose.model("Product", productSchema);

module.exports = Product;
