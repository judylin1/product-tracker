var db = require('./../models');
var bcrypt = require('bcrypt');
var logic = require('./../lib/logic.js')

module.exports = {

  allCategories: function () {
    return db.Categories.find();
  },

  addPurchase: function (user, product) {
    return db.Users.update({_id: user}, {$push: {purchases: product}})
  },

  findPurchase: function (user, product) {
    return db.Users.update({_id: user}, {$pull: {purchases: product}})
  },

}
