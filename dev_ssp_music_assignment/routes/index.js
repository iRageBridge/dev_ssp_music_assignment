var express = require('express');
var mysql = require('mysql');

var router = express.Router();

router.get('/admin', function(req, res, next) {
  res.render('playlists');
});

var databaseInfo={
  host : 'eu-cdbr-azure-west-d.cloudapp.net',
  user : 'bacd6a460a6a72',
  password : '1989368d',
  database : 'joke_db_simon'
};

router.get('/login',function(req,res,next){
  res.render('login');
});

router.get('/register', function(req,res,next){
  res.render('register');
});

router.post('/register', function(req,res,next){
  var dbConnection = mysql.createConnection(databaseInfo);
  dbConnection.connect();

  dbConnection.on('error', function(err) {
    if (err.code == 'PROTOCOL_SEQUENCE_TIMEOUT') {
      console.log('Got a DB PROTOCOL_SEQUENCE_TIMEOUT Error ... ignoring ');
    }
    else {
      console.log('Got a DB Error: ', err);
    }
  });
  dbConnection.query('INSERT INTO user (userDisplayName, userPassword) VALUES(?,?)',[req.body.username, req.body.password], function(err,results,fields){
    res.redirect('/login');
  });
});

router.post('/login', function(req,res,next){
  var dbConnection = mysql.createConnection(databaseInfo);
  dbConnection.connect();

  dbConnection.on('error', function(err) {
    if (err.code == 'PROTOCOL_SEQUENCE_TIMEOUT') {
      console.log('Got a DB PROTOCOL_SEQUENCE_TIMEOUT Error ... ignoring ');
    }
    else{
      console.log('Got a DB Error: ', err);
    }
  });

  var username = req.body.username;
  var password = req.body.password;
  dbConnection.query('SELECT userPassword FROM USER WHERE userDisplayName=?',[username],function(err,results, fields) {
    if(results.length == 0){
      res.redirect('/login');
    }
    else if(password == results[0].userPassword){
      
      req.session.username = username;
      req.session.password = password;
      res.redirect('/admin');
    }
  });
});

module.exports = router;
