var db = require('./../models');
var bcrypt = require('bcrypt');

module.exports = {

  oneUser: function (userId) {
    return db.Users.findOne({_id: userId})
  },

  products: function (user) {
    return db.Products.find({_id: {$in: user.purchases}})
  }

}
