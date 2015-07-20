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
        if (user.hash === hash) {
          //Get user preferences and store in new cookie
          knex('userpreftable')
          .where({'preferenceid': user.userid})
          .then(function())
          
          knex('preftable')
          .where({'preferenceid': user.userid})
          .then(function(result) {console.log(arguments);})
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
router.get('/logout', function(req, res, next) {
  
  res.clearCookie('preferences');
  
  res.render('logout', { title: "I'm Bored!"});
});

//Render Register Page
router.get('/register', function (req, res, next) {
  
  res.render('regis',{ title: "I'm Bored!" })
});

router.post('/register', function (req, res) {
  
  // Selects all of the usernames stored in the user name column that match the requested username
  knex('authtable').where('username', req.body.username)
  .then(function(result){
    
    //Hash and salt   
    pwd.hash(req.body.password, function(err, salt, hash) {
      var stored = {username:req.body.username, salt:salt, hash:hash};
      
      knex('authtable')
      .returning('userid')
      .insert(stored)
      .then(function(userid) {
        var prefs= []
        for (var prop in req.body) {
          if (prop !== 'username' && prop !== 'password' && prop !== 'password_confirm') {
            prefs.push(prop);
            knex('preftable')
            .insert({happyname: prop.replace('_', ' '), apiname: prop}).then();                
          }
        }
        // res.cookie('preferences', prefs.join(", "))
        console.log("HereIam")
        knex('authtable')
        .where('username',req.body.username).select('userid')
        .then(function(results) {
          if(results.length!==0) {
            var prefArr= [];
            for(var i=0;i<20;i++) {
              var k= parseInt(i)
              if(req.body[k]) {
                prefArr.push(k)
              }
            }
            for(var j=0; j<prefArr.length; j++) {
              knex('userpreftable')
              .insert([{preferenceid:prefArr[j],userid:results[0].userid }])
              .then()
            }  
            knex('userpreftable')
            .then(function() {  
                console.log("goodie")   
                res.redirect('/results')
              })
          }
        })
      })
    })
  })
})

module.exports = router;
