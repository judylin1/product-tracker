var express = require('express');
var router = express.Router();
var logic = require('./../lib/logic.js');
var db = require('./../models');
var auth = require('./../lib/auth');
var route = require('./../mongo/products');

router.get('/', auth.authorizeUser, function(req, res, next) {
  route.oneUser(res.locals.userId).then(route.allProducts).then(function (products) {
    res.render('products/index', {
      products: products,
      cookieId: req.session.username
    })
  })
});

router.get('/new', function (req, res, next) {
  res.render('products/new', {
    cookieId: req.session.username,
    categories: (logic.categories).sort()
  })
})

router.get('/:id', function (req, res, next) {
  route.oneProduct(req.params.id).then(route.allUsers).then(function (result) {
    var purchase = route.purchase(result.users, req.session.username);
    res.render('products/show', {
      product: result.product,
      purchase: purchase,
      cookieId: req.session.username
    })
  })
})

router.get('/:id/edit', auth.authorizeUser, function (req, res, next) {
  route.oneProduct(req.params.id).then(function (product) {
    res.render('products/edit', {
      cookieId: req.session.username,
      product: product,
      categories: (logic.categories).sort()
    })
  })
})

router.get('/:id/delete', auth.authorizeUser, function (req, res, next) {
  route.oneProduct(req.params.id).then(route.deleteProduct).then(route.editUser).then(route.removeCategory).then(function () {
    res.redirect('/users/' + req.session.username + '/products')
  })
})

router.post('/:id/edit', function (req, res, next) {
  var userId = req.session.username;
  var name = req.body.name;
  var price = req.body.price;
  var url = req.body.url;
  var guarantee = req.body.guarantee;
  var categories = logic.check(req.body.categories.split(' '));
  var productId = req.params.id;
  route.updateProduct(name, price, url, userId, productId, guarantee, categories).then(route.pull).then(route.push).then(function () {
    res.redirect('/users/' + userId + '/products')
  })
})

router.post('/new', function (req, res, next) {
  var userId = req.session.username;
  var name = req.body.name;
  var price = req.body.price;
  var url = req.body.url;
  var guarantee = req.body.guarantee;
  var categories = logic.check(req.body.categories.split(' '));
  route.new(name, price, url, userId, guarantee, categories).then(route.push).then(route.updateUser).then(function () {
    res.redirect('/users/' + userId + '/products')
  })
})

module.exports = router;
