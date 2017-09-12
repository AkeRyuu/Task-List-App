var express = require('express');
var router = express.Router();
var session = require('../db');
var middle = require('../security').middle;

/* GET home page. */
router.get('/', middle ,function(req, res, next) {
  res.render('vue', { title: 'Express' });
});

module.exports = router;
