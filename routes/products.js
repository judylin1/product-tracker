var util = require('util');
var express = require('express');
var router = express.Router();
var moment = require('moment');
require('moment-range');
var logic = require('./../lib/logic.js');
var db = require('./../models');
var auth = require('./../lib/auth');
var route = require('./../mongo/products');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var cloudinary = require('cloudinary');
var twilio = require('twilio'),
client = twilio(process.env.TWILIO_ACCT_SID, process.env.TWILIO_AUTH_TOKEN)
var schedule = require('node-schedule');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get('/', auth.authorizeUser, function(req, res, next) {
  route.oneUser(res.locals.userId).then(route.allProducts).then(function (products) {
    res.render('products/index', {
      moment: moment,
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
      moment: moment,
      product: result.product,
      purchase: purchase,
      cookieId: req.session.username
    })
  })
})

router.get('/:id/edit', auth.authorizeUser, function (req, res, next) {
  route.oneProduct(req.params.id).then(function (product) {
    res.render('products/edit', {
      moment: moment,
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
  var serial = req.body.serial;
  var price = req.body.price;
  var purchase_date = req.body.purchase_date;
  var exp_date = req.body.exp_date;
  var customDate = req.body.customDate;
  if (exp_date == '30-day') {
    var exp_on = moment(new Date(purchase_date)).add(30, 'd').format('MM/DD/YYYY');
  }
  else if (exp_date == '60-day') {
    var exp_on = moment(new Date(purchase_date)).add(60, 'd').format('MM/DD/YYYY');
  }
  else if (exp_date == '90-day') {
    var exp_on = moment(new Date(purchase_date)).add(90, 'd').format('MM/DD/YYYY');
  }
  else if (exp_date == '1-year') {
    var exp_on = moment(new Date(purchase_date)).add(1, 'y').format('MM/DD/YYYY');
  }
  else if (exp_date == '3-year') {
    var exp_on = moment(new Date(purchase_date)).add(3, 'y').format('MM/DD/YYYY');
  }
  else if (exp_date == '5-year') {
    var exp_on = moment(new Date(purchase_date)).add(5, 'y').format('MM/DD/YYYY');
  }
  else if (exp_date == '10-year') {
    var exp_on = moment(new Date(purchase_date)).add(10, 'y').format('MM/DD/YYYY');
  }
  else if (exp_date === 'lifetime') {
    var exp_on = "Lifetime Warranty";
  }
  else if (exp_date === 'customDate') {
    var exp_on = customDate;
  }
  var store = req.body.store;
  var guarantee = req.body.guarantee;
  var categories = logic.check(req.body.categories.split(' '));
  var productId = req.params.id;
  route.updateProduct(name, serial, price, purchase_date, exp_date, exp_on, store, userId, productId, guarantee, categories).then(route.pull).then(route.push).then(function () {
    res.redirect('/users/' + userId + '/products')
  })
})

router.post('/new', multipartMiddleware, function (req, res, next) {
  // cloudinary.api.resource("sample1", function(result)  {
  //   console.log(result)
  // })
  var productImg = req.files.productImg.path;
  var receiptURL = req.files.receiptURL.path;
  var userId = req.session.username;
  var name = req.body.name;
  var serial = req.body.serial;
  var price = req.body.price;
  var purchase_date = req.body.purchase_date;
  var phone = req.body.phone;
  var exp_date = req.body.exp_date;
  var customDate = req.body.customDate;
  if (exp_date == '30-day') {
    var exp_on = moment(new Date(purchase_date)).add(30, 'd').format('MM/DD/YYYY');
  }
  else if (exp_date == '60-day') {
    var exp_on = moment(new Date(purchase_date)).add(60, 'd').format('MM/DD/YYYY');
  }
  else if (exp_date == '90-day') {
    var exp_on = moment(new Date(purchase_date)).add(90, 'd').format('MM/DD/YYYY');
  }
  else if (exp_date == '1-year') {
    var exp_on = moment(new Date(purchase_date)).add(1, 'y').format('MM/DD/YYYY');
  }
  else if (exp_date == '3-year') {
    var exp_on = moment(new Date(purchase_date)).add(3, 'y').format('MM/DD/YYYY');
  }
  else if (exp_date == '5-year') {
    var exp_on = moment(new Date(purchase_date)).add(5, 'y').format('MM/DD/YYYY');
  }
  else if (exp_date == '10-year') {
    var exp_on = moment(new Date(purchase_date)).add(10, 'y').format('MM/DD/YYYY');
  }
  else if (exp_date === 'lifetime') {
    var exp_on = "Lifetime Warranty";
  }
  else if (exp_date === 'customDate') {
    var exp_on = customDate;
  }

  // send text 7 day before warranty expires
  if (moment(new Date(exp_on)).isAfter(moment(new Date()))) {
    var weekBefore = moment(new Date(exp_on)).subtract(7, 'day').format('MM/DD/YYYY');
    var job = schedule.scheduleJob(weekBefore, function() {
       client.sendMessage ({
           to: phone,
           from: '+19724558907',
           body: "The warranty for your " + name + " is about to expire!"
       },
       function(err, responseData) {
         if (!err) {
             console.log("text scheduled");
         }
         else {
           console.log("unable to schedule text")
         }
       })
     })
 }

  var store = req.body.store;
  var guarantee = req.body.guarantee;
  cloudinary.uploader.upload(receiptURL, function(result) {
    var receiptURL = result.url;
  cloudinary.uploader.upload(productImg, function(result) {
    var productImg = result.url;
  var categories = logic.check(req.body.categories.split(' '));
  route.new(name, serial, price, purchase_date, exp_date, exp_on, store, phone, userId, guarantee, receiptURL, productImg, categories).then(route.push).then(route.updateUser).then(function () {
    res.redirect('/users/' + userId + '/products')
  })
})
});
});

module.exports = router;
