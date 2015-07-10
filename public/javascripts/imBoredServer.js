

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var env = process.env.NODE_ENV || 'development';
var knexConfig = require('./knexfile.js')[env];
var knex = require('knex')(knexConfig);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));
app.use(express.static(__dirname));

// app.get('/', function (req,res){
// 	some code
// 	res.render('index')

// })

app.get('/register', function (req,res){
	res.render('/regis')
})

app.post('/register', function (req,res){
	// Selects all of the usernames stored in the user name column that match the requested username
	knex('users').where('username', req.body.e-mail)
		.then(function(result)){
			// result is the usernames that match the requested username. If the result.length>0 then that means that that username is already in the DB.
			if(result.length>0){
				res.redirect(//WhatEver our error view is)
			}else{
	knex('users').insert([{username:req.body.e-mail, hash:stored.hash,salt: stored.salt,userid: req.body.id}])
			}.then(function(){ 
				knex('preftable').returning('id')insert([{
				prefences:[req.body.prefId] // An array of the user's prefences might be best?
				}])

				res.redirect('/results');
			})
	}
})

app.post('/login', function (req,res){
	// Selects all of the usernames stored in the user name column that match the requested username
	knex.('users').where('username', req.body.user)
		.then(function(result){
			// result is the usernames that match the requested username. If the result.length=== 1 then that means that that username is in the DB.
			if(result.length===1){
				res.redirect(/*Whatever our result/options page is*/, //{prefences:[Maybe like an array of the perferences?]})
			}else{
				res.redirect(//Error view saying username is not valid)
			}
		})
})


