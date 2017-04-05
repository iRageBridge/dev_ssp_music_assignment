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

router.get('/', function(req, res, next) {
  //console.log(req.session.userId);
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

  dbConnection.query('SELECT * FROM playlists WHERE userId = ?',[req.session.userId], function(err, results, fields){
    if (err) {
      throw err;
    }

    var allPlaylists = new Array();
    for(var i=0; i<results.length; i++){
      var playlist={};
      playlist.id = results[i].playlistId;
      playlist.name = results[i].playlistName;
      playlist.userId = results[i].user_userId;
      allPlaylists.push(playlist);
    }
    dbConnection.end();
    res.render('playlists',{playlists: allPlaylists});
  });
});

router.get('/newPlaylist', function(req,res,next){
  res.render('newPlaylist');
});

router.post('/newPlaylist', function(req,res,next){ 
  var dbConnection = mysql.createConnection(localDbInfo);
  dbConnection.connect();
  dbConnection.on('error', function(err) {
    if (err.code == 'PROTOCOL_SEQUENCE_TIMEOUT') {
      console.log('Got a DB PROTOCOL_SEQUENCE_TIMEOUT Error ... ignoring ');
    } else {
      console.log('Got a DB Error: ', err);
    }
  });

  var playlist={};
  playlist.name=req.body.playlistName;

  dbConnection.query('INSERT INTO playlists (playlistName,userId) VALUES(?,?)',[playlist.name,req.session.userId],function(err,results,fields){
    if(err){
      throw err;
    }

    playlist.id = results.insertId;

    dbConnection.end();
    res.redirect('/admin');
  });
});

router.get('/playlist/:id',function(req,res,next){
  req.session.currentPlaylist = req.params.id;
  console.log(req.session.currentPlaylist);
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

  dbConnection.query('SELECT * FROM tracks WHERE playlistId= ?',[req.session.currentPlaylist], function(err, results, fields){
    if (err) {
      throw err;
    }
    console.log("Results" + results);
    var allTracks = new Array();
    for(var i=0; i<results.length; i++){
      var track={};
      track.id = results[i].trackId;
      track.name = results[i].trackName;
      track.url = results[i].trackURL;
      allTracks.push(track);
    }
    dbConnection.end();
    res.render('playlist',{tracks: allTracks});
  });
});

router.post('/playlist', function(req,res,next){
    
});

router.get('/newSound', function(req,res,next){
  res.render('newSound');
});

router.post('/newSound',function(req,res,next){
  var dbConnection = mysql.createConnection(localDbInfo);
  dbConnection.connect();
  dbConnection.on('error', function(err) {
    if (err.code == 'PROTOCOL_SEQUENCE_TIMEOUT') {
      console.log('Got a DB PROTOCOL_SEQUENCE_TIMEOUT Error ... ignoring ');
    } else {
      console.log('Got a DB Error: ', err);
    }
  });

  var track={};
  track.name = req.body.trackName;
  track.url = req.body.trackURL;

  dbConnection.query('INSERT INTO tracks (trackName,trackURL,playlistId) VALUES(?,?,?)',[track.name,track.url,req.session.currentPlaylist],function(err,results,fields){
    if(err){
      throw err;
    }

    track.id = results.insertId;

    dbConnection.end();
    res.redirect('/admin');
  });
});

module.exports = router;