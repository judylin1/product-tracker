var express = require('express');
var router = express.Router();
var db = require('./../models');
var route = require('./../mongo/categories');

router.get('/:id', function (req, res, next) {
  route.oneCategory(req.params.id).then(route.userProducts).then(function (result) {
    res.render('categories/show', {
      category: result.category,
      products: result.products,
      cookieId: req.session.username
     })
  })
})

module.exports = router
