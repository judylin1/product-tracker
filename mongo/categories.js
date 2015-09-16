var db = require('./../models');
var bcrypt = require('bcrypt');
var logic = require('./../lib/logic.js')

module.exports = {

  oneCategory: function (categoryId) {
    return db.Categories.findOne({_id: categoryId})
  },

  userProducts: function (category) {
    var promise = new Promise(function (resolve, reject) {
      var products;
      db.Products.find({_id: {$in: category.products}}).then(function (bm) {
        products = bm;
        var usersId = products.map(function (product) {
          return product.userId;
        })
        return db.Users.find({_id: {$in: usersId}})
      }).then(function (users) {
        logic.userProd(products, users);
        resolve({category: category, products: products})
      })
    })
    return promise;
  },

}
