var express = require('express');
var router = express.Router();
var app = require('../app');
// var pwd = require('pwd');
var database = app.get('database');
var knex = require('knex');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('index', { title: 'Express' });
});

module.exports = router;
