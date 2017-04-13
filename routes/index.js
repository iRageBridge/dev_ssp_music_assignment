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
  var userMessage = req.session.userMessage ? req.session.userMessage : "";
  req.session.userMessage = "";
  var registerMessage = req.session.registerMessage ? req.session.registerMessage : "";
  req.session.registerMessage = "";
  res.render('login', {msg: userMessage, regmsg: registerMessage});
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
  dbConnection.query('SELECT userPassword,userId FROM users WHERE userDisplayName=?',[username],function(err,results, fields) {
    if(results.length == 0){
      req.session.userMessage = "User " + username + " not registered";
      res.redirect('/login');
    }
    else if(results.length !=0 && (password != results[0].userPassword)){
      req.session.userMessage = "Incorrect Password";
      res.redirect('/login');
    }
  
    else if(password == results[0].userPassword){
      req.session.username = username;
      req.session.password = password;
      req.session.userId = results[0].userId;
      
      res.redirect('/admin');
    }
    else{
      req.session.userMessage = username + " is not a registered username";
      res.redirect('/login');
    }
  });
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

  dbConnection.query('SELECT * FROM users WHERE userDisplayName = ?', [req.body.username],function(err,results, fields) {  
    if(results.length == 0){
      dbConnection.query('INSERT INTO users (userDisplayName, userPassword) VALUES(?,?)',[req.body.username, req.body.password], function(err,results,fields){
        if((req.body.username != '') && (req.body.password != '')){
          req.session.userId = results.insertId;
          req.session.username=req.body.username;
          res.redirect('/admin');
        }
        else{
          req.session.registerMessage = "An unexpected error occured, please try again"
          res.redirect('/login');
        }
      });
    }
    else{
      req.session.registerMessage = "Username " + req.body.username + " already exists";
      res.redirect('/login');
    }
  });
});

router.get('/logout',function(req,res,next){
  req.session.destroy();
  res.redirect('/admin');
});

module.exports = router;