var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var app = require('../app');
// var pwd = require('pwd');
var knexConfig = require('../knexfile.js')
var knex = require('knex')(knexConfig);
var database = app.get('database');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));
app.use(express.static('public'));
/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('index', { title: "I'm Bored!" });

router.get('/results', function(req, res, next) {

  res.render('results', { title: "I'm Bored!" });
});

router.get('/register', function (req,res,next){
	res.render('regis',{ title: "I'm Bored!" })
})

router.post('/register', function (req,res){
	var prefArr= [];
	for(var i=0;i<req.body.length-3;i++){
		prefArr.push(req.body[i])
	}
	console.log(req.body)
	// Selects all of the usernames stored in the user name column that match the requested username
	knex('authtable').where('username', req.body.email)
		.then(function(result){
			console.log(result)
			// result is the usernames that match the requested username. If the result.length>0 then that means that that username is already in the DB.
			if(result.length===0){
				console.log(req.body)

				knex('authtable').insert([{username:req.body.email}])
				.then(function() {
				
				console.log('worked!!!')
				res.redirect('/')
				})
	// 		}else{
	// knex('authtable').insert([{username:req.body.email/* hash:stored.hash,salt: stored.salt,userid: req.body.id*/}])
	// 		.then(function(){ 
	// 			knex('useridtable').returning('id').insert([{
	// 			prefenceid:prefArr // An array of the user's prefences might be best?
	// 			}])

	// 			res.redirect('/');
	// 		})
		}	
	})
})

// router.post('/login', function (req,res){
// 	// Selects all of the usernames stored in the user name column that match the requested username
// 	knex('users').where('username', req.body.user)
// 		.then(function(result){
// 			// result is the usernames that match the requested username. If the result.length=== 1 then that means that that username is in the DB.
// 			if(result.length===1){
// 				res.redirect(/*Whatever our result/options page is {prefences:[Maybe like an array of the perferences?]}*/)
// 			}else{
// 				res.redirect(/*Error view saying username is not valid*/)
// 			}
// 		})
// })
>>>>>>> master

module.exports = router;
