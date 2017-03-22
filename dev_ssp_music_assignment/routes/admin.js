var express = require('express');
var mysql = require('mysql');

var router = express.Router();

var databaseInfo={
  host : 'eu-cdbr-azure-west-d.cloudapp.net',
  user : 'bacd6a460a6a72',
  password : '1989368d',
  database : 'joke_db_simon'
};

router.get('/', function(req, res, next) {
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

  dbConnection.query('SELECT * FROM playlists', function(err, results, fields){
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
  var dbConnection = mysql.createConnection(databaseInfo);
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

  dbConnection.query('INSERT INTO playlists (playlistName) VALUES(?)',[playlist.name],function(err,results,fields){
    if(err){
      throw err;
    }

    playlist.id = results.insertId;

    dbConnection.end();
    res.redirect('/admin');
  });
});

router.get('/playlist',function(req,res,next){
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

  dbConnection.query('SELECT * FROM tracks', function(err, results, fields){
    if (err) {
      throw err;
    }

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
  var dbConnection = mysql.createConnection(databaseInfo);
  dbConnection.connect();
  dbConnection.on('error', function(err) {
    if (err.code == 'PROTOCOL_SEQUENCE_TIMEOUT') {
      console.log('Got a DB PROTOCOL_SEQUENCE_TIMEOUT Error ... ignoring ');
    } else {
      console.log('Got a DB Error: ', err);
    }
  });

  var track={};
  track.name=req.body.trackName;
  track.url = req.body.trackURL;

  dbConnection.query('INSERT INTO tracks (trackName,trackURL) VALUES(?,?)',[track.name,track.url],function(err,results,fields){
    if(err){
      throw err;
    }

    track.id = results.inserdId;

    dbConnection.end();
    res.redirect('/playlist');
  });
});

module.exports = router;