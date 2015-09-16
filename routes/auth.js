var express = require('express');
var router = express.Router();
var auth = require('./../lib/auth');
var route = require('./../mongo/auth');
var validations = require('../public/javascripts/validations.js');

router.get('/logout', function(req, res, next) {
  req.session = null;
  res.redirect('/');
});

router.get('/login', auth.authorizeLogin, function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  var errors = validations.loginValidation(req.body.name, req.body.password)
  if(errors.length === 0) {
  route.login(req.body.name, req.body.password).then(function (user) {
    req.session.username = user._id;
    res.redirect('/users/' + user._id);
  })
}
  else {
    res.render('login', {
      errors: errors,
      name: req.body.name });
  }
});

router.get('/signup', auth.authorizeLogin, function(req, res, next) {
  res.render('signup');
});

router.post('/signup', function(req, res, next) {
  var errors = validations.signupValidation(req.body.name, req.body.password, req.body.confirmation)
  if (errors.length === 0) {
    route.signup(req.body.name, req.body.password).then(function (user) {
      req.session.username = user._id;
      res.redirect('/users/' + user._id);
  })
}
  else {
    res.render('signup', {
      errors: errors,
      name: req.body.name,
     });
  }
});

module.exports = router;
