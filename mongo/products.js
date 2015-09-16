var db = require('./../models');
var bcrypt = require('bcrypt');
var logic = require('./../lib/logic.js');

module.exports = {

  oneUser: function (userId) {
    return db.Users.findOne({_id: userId})
  },

  allUsers: function (product) {
    var promise = new Promise(function (resolve, reject) {
      db.Users.find({purchases: String(product._id)}).then(function (users) {
        resolve({users:users, product:product})
      })
    })
    return promise
  },

  editUser: function (product) {
    return db.Users.update({_id: product.userId}, {$pull: {products: product._id}}).then(function () {
      return product;
    });
  },

  updateUser: function (resolve) {
    return db.Users.findByIdAndUpdate(resolve.userId, {$push: {products: resolve.product._id}}, {new: true})
  },

  oneProduct: function (id) {
    return db.Products.findOne({_id: id})
  },

  allProducts: function (user) {
    return db.Products.find({_id: {$in: user.products}})
  },

  new: function (name, price, url, userId, guarantee, categories) {
    var promise = new Promise(function (resolve, reject) {
      db.Products.create({name: name, price: price, url: url,
        userId: userId, guarantee: guarantee,
        categories: categories}).then(function (product) {
        resolve({product: product, categories: categories, userId: userId})
      })
    })
    return promise;
  },

  updateProduct: function (name, price, url, userId, productId, guarantee, categories) {
    var promise = new Promise(function (resolve, reject) {
      db.Products.findByIdAndUpdate(productId, {$set: {name: name, price: price, url: url,
         userId: userId, guarantee: guarantee,
         categories: categories}}).then(function (product) {
           resolve({product:product, categories: categories, userId: userId})
         })
    })
    return promise;
  },

  deleteProduct: function (product) {
    return db.Products.findOneAndRemove({_id: product._id}).then(function () {
      return product
    })
  },

  purchase: function (users, id) {
    var purchase = false;
    users.forEach(function (user) {
      if (String(user._id) === String(id)) {
        purchase = true
      }
    })
    return purchase
  },

  removeCategory: function (product) {
    return db.Categories.update({}, {$pull: {products: product._id}}, {multi: true}).then(function () {
      return product;
    })
  },

  push: function (result) {
    var promise = new Promise(function (resolve, reject) {
      Promise.all(result.categories.map(function (category) {
        return db.Categories.update({name: category}, {name: category, $push: {products: result.product._id} }, {upsert: true})
      })).then(function (data) {
        resolve({product: result.product, userId: result.userId})
      })
    })
    return promise
  },

  pull: function (result) {
    var promise = new Promise (function (resolve, reject) {
      db.Categories.update({}, {$pull: {products: result.product._id}}, {multi: true}).then(function () {
        resolve(result)
      })
    })
    return promise
  },

}
