var express = require('express');
var router = express.Router();
var route = require('./../mongo/index.js');
amazon = require('amazon-product-api');

var client = amazon.createClient({
  awsId: process.env.AMAZON_ACCESS_KEY_ID,
  awsSecret: process.env.AMAZON_SECRET_ACCESS_KEY,
  awsTag: process.env.AMAZON_SECRET
});

router.get('/', function (req, res, next) {
  route.allCategories().then(function (categories) {
    res.render('categories/index', {
      cookieId: req.session.username,
      categories: categories
    })
  })
})

router.get('/amazon', function(req, res, next) {
  res.render('amazon', {
    cookieId: req.session.username
  })
})

router.post('/amazon', function(req, res, next) {
  client.itemSearch({
    searchindex: req.body.searchIndex,
    keywords: req.body.keywords,
    responseGroup: 'ItemAttributes,Offers,Images'
  }).then(function(results) {
    res.render('amazon', {
      results: results,
      cookieId: req.session.username
    })
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
