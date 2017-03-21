var express = require('express');
var mysql = require('mysql');

var router = express.Router();

var databaseInfo={
  host : 'eu-cdbr-azure-west-d.cloudapp.net',
  user : 'bacd6a460a6a72',
  password : '1989368d',
  database : 'joke_db_simon'
};

router.get('/addSound', function(req,res,next){
    res.render('addSound');
});

module.exports = router;