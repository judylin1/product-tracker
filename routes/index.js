var express = require('express');
var router = express.Router();
var route = require('./../mongo/index.js');

router.get('/', function (req, res, next) {
  route.allCategories().then(function (categories) {
    res.render('categories/index', {cookieId: req.session.username, categories: categories})
  })
})

router.get('/purchase', function (req, res, next) {
  var user = req.session.username;
  var product = req.query.product;
  if (req.query.checked === 'yes') {
    route.addPurchase(user,product).then(function () {})
  } else {
    route.findPurchase(user,product).then(function () {})
  }
})

module.exports = router;
