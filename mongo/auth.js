var db = require('./../models');
var bcrypt = require('bcrypt');

module.exports = {

  signup: function (name, password) {
    var promise = new Promise(function (resolve, reject) {
      db.Users.findOne({name: name}).then(function (user) {
        var hash = bcrypt.hashSync(password, 8);
        if (user) {
          var error = 'That name is already taken. Try again.';
          reject(error)
        } else {
          db.Users.create({name: name, password: hash, purchases: [], products: []}).then(function () {
            return db.Users.findOne({name: name})
          }).then(function (user) {
              resolve(user)
          })
        }
      })
    })
    return promise
  },

  login: function (name, password) {
    var promise = new Promise(function (resolve, reject) {
      db.Users.findOne({name: name}).then(function (user) {
        if (user) {
          if (bcrypt.compareSync(password, user.password)) {
              resolve(user)
          } else {
            var error = 'Incorrect password.';
            reject(error)
          }
        } else {
          var error = 'Incorrect name.';
          reject(error)
        }
      })
    })
    return promise
  },

}
