var express = require('express');
var app = express();
var router = express.Router();

app.use(express.static('public'));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('regis', { title: "I'm Bored!" });
});

router.get('/js', function(req, res, next) {
	res.serve('../js');
});

module.exports = router;
