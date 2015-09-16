var express = require('express');
var router = express.Router();
var auth = require('./../lib/auth');
var route = require('./../mongo/users');

router.get('/', auth.authorizeUser, function(req, res, next) {
  route.oneUser(req.session.username).then(route.products).then(function (products) {
    res.render('users/index', {
      products: products,
      cookieId: req.session.username
    })
  })
});

module.exports = router;
