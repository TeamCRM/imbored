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
  
  if (req.cookies.username) {
    res.render('results', { title: "I'm Bored!" })
  } else {
    res.render('login', { title: "I'm Bored!" });
  };  
});

router.post('/', function (req, res) {

  knex('authtable').where({'username': req.body.username}).then(function(records) {
    var user = records[0];
    if (records.length === 0) {
      console.log('Record length is 0');
      res.render('login', {
        title: 'Im Bored',
        user: null,
        error: 'No Such User'
      });
      
    } else {
        pwd.hash(req.body.password, user.salt, function(err,hash) {
          if (err) {
            console.log(err);
          }
          if (user.hash === hash) {
            res.cookie('username', req.body.username);
            res.render('results', {title: "I'm Bored!"});
            
          } else {
              res.render('login', {
                title: 'Im Bored',
                user: null,
                error: 'Incorrect Password '
              });
          }
        });
    }
  });
});
//Render Results Page
router.get('/results', function(req, res, next) {

  res.render('results', { title: "I'm Bored!" });
});

//Logout and clear cookie 
router.get('/logout', function(req, res, next){
  
  res.clearCookie('username');
  
	res.render('logout', { title: "I'm Bored!"});
});

//Render Register Page
router.get('/register', function (req,res,next){
  
	res.render('regis',{ title: "I'm Bored!" })
});

router.post('/register', function (req,res){
	
	// Selects all of the usernames stored in the user name column that match the requested username
	knex('authtable').where('username', req.body.username)
		.then(function(result){
      
			// result is the usernames that match the requested username. If the result.length>0 then that means that that username is already in the DB.
			if(result.length===0){
				var prefArr= [];
				for(var i=0;i<20;i++){
					var k= parseInt(i)
					if(req.body[k]){
					prefArr.push(k)
					}
				}
        
      //Hash and salt   
      pwd.hash(req.body.password, function(err,salt,hash){
        var stored = {username:req.body.username, salt:salt, hash:hash};
        console.log(stored);
        
        knex('authtable').insert(stored)
          .then(function() {
            res.cookie('username', req.body.username)
            res.redirect('/results')
          })
      })
        
			// .then(function() {
			// 	knex('authtable').where('username',req.body.username).select('userid')
			// 		.then(function(results){   
    	// 			for(var j=0;j<prefArr.length;j++){
    	// 			knex('useridtable').insert([{preferenceid:prefArr[j],userid:results[0].userid }])
    	// 				.then(function(){     
    	// 		         res.redirect('/results')
    	// 				})
    	// 			}
    	// 		})
    	// })
		}	
	})
})

module.exports = router;


