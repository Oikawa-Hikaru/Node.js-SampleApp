var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'サンプルページ'});
});

console.log('index.js is Loaded.');

module.exports = router;
