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

  res.render('opt-res', { title: "I'm Bored!" });
});

router.get('/js', function(req, res, next) {
	res.serve('../js');

});

module.exports = router;
