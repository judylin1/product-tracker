var db = require('./../models');

module.exports = {

  authorizeLogin: function (req, res, next) {
    if (!req.session.username) {
      next()
    } else {
      res.redirect('/')
    }
  },

  authorizeUser: function (req, res, next) {
    db.Users.findOne({_id: res.locals.userId}).then(function (user) {
      if (req.session.username === user._id.toString()) {
        next()
      } else {
        res.redirect('/')
      }
    })
  },

}
