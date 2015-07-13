

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var env = process.env.NODE_ENV || 'development';
var knexConfig = require('./knexfile.js')[env];
var knex = require('knex')(knexConfig);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));
app.use(express.static(__dirname));

<<<<<<< HEAD
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
=======
// app.get('/register', function (req,res){

// })

app.put('/register', function (req,res){
	// Selects all of the usernames stored in the user name column that match the requested username
	knex('users').where('username', req.body.username)
>>>>>>> 0df65827881ddd0c856b1355fbb65c20cc7583af
		.then(function(result)){
			// result is the usernames that match the requested username. If the result.length>0 then that means that that username is already in the DB.
			if(result.length>0){
				res.redirect(//WhatEver our error view is)
			}else{
<<<<<<< HEAD
	knex('users').insert([{username:req.body.e-mail, hash:stored.hash,salt: stored.salt,userid: req.body.id}])
			}.then(function(){ 
				knex('preftable').returning('id')insert([{
				prefences:[req.body.prefId] // An array of the user's prefences might be best?
				}])

				res.redirect('/results');
=======
	knex('users').insert([{username:req.body.username, hash:stored.hash,salt: stored.salt}])
			}.then(function()}{ // Need to write code that will put the prefences id's in as well and then select those, probably need to have a global var that is an obj that can hold the users preferences and then use that as the object for the res.render call.
				res.redirect(//Whatever our result/options page is, {prefences:[Maybe like an array of the perferences?]})
>>>>>>> 0df65827881ddd0c856b1355fbb65c20cc7583af
			})
	}
})

<<<<<<< HEAD
app.post('/login', function (req,res){
	// Selects all of the usernames stored in the user name column that match the requested username
	knex.('users').where('username', req.body.user)
		.then(function(result){
			// result is the usernames that match the requested username. If the result.length=== 1 then that means that that username is in the DB.
			if(result.length===1){
				res.redirect(/*Whatever our result/options page is*/, //{prefences:[Maybe like an array of the perferences?]})
			}else{
				res.redirect(//Error view saying username is not valid)
=======
app.put('/login', function (req,res){
	// Selects all of the usernames stored in the user name column that match the requested username
	knex.('users').where('username', req.body.username)
		.then(function(result){
			// result is the usernames that match the requested username. If the result.length=== 1 then that means that that username is in the DB.
			if(result.length===1){
				res.render(/*Whatever our result/options page is*/, //{prefences:[Maybe like an array of the perferences?]})
			}else{
				res.render(//Error view saying username is not valid)
>>>>>>> 0df65827881ddd0c856b1355fbb65c20cc7583af
			}
		})
})


