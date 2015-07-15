var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var app = require('../app');
var pwd = require('pwd');
var knexConfig = require('../knexfile.js')
var knex = require('knex')(knexConfig);
var database = app.get('database');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));
app.use(express.static('public'));

/* GET home page. */
router.get('/', function (req, res, next) {
  
  if (req.cookies.email) {
    username = req.cookies.email;
  } else {
    username = null;
  };  
  
  res.render('/', { title: "I'm Bored!" });
});

router.post('/', function (req, res) {
  var user = records[0];
  knex('authtable').where({'username': req.body.email}).then(function(records) {
    
    if (records.length === 0) {
      res.render('index', {
        title: 'Im Bored',
        user: null,
        error: 'No Such User'
      });
    } else {
        if (user.password === password) {
          res.cookie('username', req.body.email);
        } else {
            res.render('index', {
              title: 'Im Bored',
              user: null,
              error: 'Incorrect Password '
            });
        }
    }
  });
});

router.get('/results', function(req, res, next) {

  res.render('results', { title: "I'm Bored!" });
});

router.get('/register', function (req,res,next){
	res.render('regis',{ title: "I'm Bored!" })
})

router.post('/register', function (req,res){
	
	// console.log(req.body)
	// console.log(req.body[1])
	// Selects all of the usernames stored in the user name column that match the requested username
	knex('authtable').where('username', req.body.email)
		.then(function(result){
			// result is the usernames that match the requested username. If the result.length>0 then that means that that username is already in the DB.

			if(result.length===0){
				var prefArr= [];
				// console.log(req.body[17])
				for(var i=0;i<20;i++){
					var k= parseInt(i)
					// console.log(req.body[k])
					if(req.body[k]){
					prefArr.push(k)
					// console.log(prefArr)
					}
				}
        
      //Hash and salt   
      pwd.hash(req.body.password, function(err,salt,hash){
        var stored = {username:req.body.email, salt:salt, hash:hash};
        console.log(stored);
        
        knex('authtable').insert(stored)
          .then(function() {
            res.cookie('username', req.body.email)
            res.redirect('/results')
          })
      })
        
			// console.log(req.body)
			// console.log(prefArr)
			// knex('authtable').insert([{username:req.body.email}])
			.then(function() {
				knex('authtable').where('username',req.body.email).select('userid')
					.then(function(results){
						// console.log(results)      
            
				for(var j=0;j<prefArr.length;j++){
				knex('useridtable').insert([{preferenceid:prefArr[j],userid:results[0].userid }])
					.then(function(){      
			// console.log('worked!!!')
			res.redirect('/results')
						})
					}
				})
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


module.exports = router;
