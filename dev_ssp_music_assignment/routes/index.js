var express = require('express');
var mysql = require('mysql');

var router = express.Router();

var databaseInfo={
  host : 'eu-cdbr-azure-west-d.cloudapp.net',
  user : 'bacd6a460a6a72',
  password : '1989368d',
  database : 'joke_db_simon'
};

var localDbInfo = {
  connectionLimit : 3,
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'musicSharing'
};
router.get('/',function(req,res,next){
  res.redirect('/admin');
});

router.get('/login',function(req,res,next){
  res.render('login');
});

router.post('/login', function(req,res,next){
  var dbConnection = mysql.createConnection(localDbInfo);
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
  dbConnection.query('SELECT userPassword,userId FROM users WHERE userDisplayName=?',[username],function(err,results, fields) {
    
    if(results.length == 0){
      res.redirect('/register');
    }
    else if(password == results[0].userPassword){
      req.session.username = username;
      req.session.password = password;
      req.session.userId = results[0].userId;
      
      res.redirect('/admin');
    }
  });
});

router.get('/register', function(req,res,next){
  res.render('register');
});

router.post('/register', function(req,res,next){
  var dbConnection = mysql.createConnection(localDbInfo);
  dbConnection.connect();

  dbConnection.on('error', function(err) {
    if (err.code == 'PROTOCOL_SEQUENCE_TIMEOUT') {
      console.log('Got a DB PROTOCOL_SEQUENCE_TIMEOUT Error ... ignoring ');
    }
    else {
      console.log('Got a DB Error: ', err);
    }
  });
  dbConnection.query('INSERT INTO users (userDisplayName, userPassword) VALUES(?,?)',[req.body.username, req.body.password], function(err,results,fields){
    res.redirect('/login');
  });
});

router.get('/logout',function(req,res,next){
  req.session.destroy();
  res.redirect('/admin');
});

module.exports = router;
