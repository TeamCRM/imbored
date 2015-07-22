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
  
  if (req.cookies.preferences) {
    res.render('results', { title: "I'm Bored!" })  
  } else {
    res.render('login', { title: "I'm Bored!" });
  };  
});

//Login 
router.post('/', function (req, res) {
  
  knex('authtable')
  .where({'username': req.body.username})
  .then(function(records) {
    var user = records[0];
    if (records.length === 0) {
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
        console.log(req.body)
        if (user.hash === hash) {
          
          //Get user ID from DB
          knex('authtable')
          .where({'username': req.body.username}).select('userid')
          .then(function(results) {
            var userid = results[0].userid
            //Get user preferences from DB
            knex('userpreftable')
            .where({'userid': results[0].userid}).select('preferenceid')
            .then(function(result){
              var prefs= []
              //Store user preferences in prefs array
              for (var prop in result) {
                if  (prop !== 'userid') {
                  prefs.push(result[prop].preferenceid)
                }
              }
              //Put user preferences in cookie and render results page 
              knex('userpreftable')
              .where({'userid': userid}).select('preferenceid')
              .then(function(results){
                console.log("MILK")
                console.log(results)
                knex('preftable')
                .where({'preferenceid': results.preferenceid}).select('apiname')
                .then(function(result) {
                  var apiCall = []
                  console.log("RES")
                  console.log(result)
                  console.log("ULT")
                  for (var api in result) {
                    if (api === 'apiname') {
                      apiCall.push(result[api].apiname)
                      console.log("DONE")
                    }
                  }
                  
                  knex('userpreftable')
                  .then()
                  console.log("COOKIE")
                  console.log(apiCall)
                  res.cookie('preferences', apiCall.join())
                  res.redirect('/results');
                })
              })  
            })    
          })
        
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
router.get('/logout', function(req, res, next) {
  
  res.clearCookie('preferences');
  
  res.render('logout', { title: "I'm Bored!"});
});

//Render Register Page
router.get('/register', function (req, res, next) {
  
  res.render('regis',{ title: "I'm Bored!" })
});

router.post('/register', function (req, res) {
  var prefArr= [];
  var prefs= [];
  // Selects all of the usernames stored in the user name column that match the requested username
  knex('authtable')
  .where({'username': req.body.username})
  .then(function(result){
    
    //Hash and salt   
    pwd.hash(req.body.password, function(err, salt, hash) {
      var stored = {username:req.body.username, salt:salt, hash:hash};
      
      knex('authtable')
      .returning('userid')
      .insert(stored)
      .then(function(userid) {

        for (var prop in req.body) {
          if (prop !== 'username' && prop !== 'password' && prop !== 'password_confirm') {
            prefs.push(prop);               
          }
        }
        res.cookie('preferences', prefs.join())
        
        knex('authtable')
        .where({'username': req.body.username}).select('userid')
        .then(function(results) {
          
          if(results.length!==0) {
            
            for(var i=0;i<20;i++) {
              var k= parseInt(i)
              if(req.body[k]) {
                prefArr.push(k)
              }
            }
            for(var j=0; j<prefArr.length; j++) {
              knex('userpreftable')
              .insert([{preferenceid:prefArr[j],userid:results[0].userid}])
              .then()
            }  
            knex('userpreftable')
            .then(function() {  
              res.redirect('/results')
            })
          }
        })
      })
    })
  })
})

module.exports = router;