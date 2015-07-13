var express = require('express');
var app = express();
var router = express.Router();
var app = require('../app');
// var pwd = require('pwd');
var database = app.get('database');
var knex = require('knex');

app.use(express.static('public'));
/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: "I'm Bored!" });
});

router.get('/register', function(req, res, next) {

  res.render('regis', { title: "I'm Bored!" });
});
router.get('/results', function(req, res, next) {

  res.render('results', { title: "I'm Bored!" });
});

router.get('/js', function(req, res, next) {
	res.serve('../js');

});



module.exports = router;
