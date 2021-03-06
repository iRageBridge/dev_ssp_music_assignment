var express = require('express');
var mysql = require('mysql');

var router = express.Router();

/*var localDbInfo={
  host : 'sql11.freemysqlhosting.net',
  user : 'sql11169317',
  password : 'gDIKpwItWX',
  database : 'sql11169317'
};*/

var localDbInfo={
  host : 'eu-cdbr-azure-west-d.cloudapp.net',
  user : 'bacd6a460a6a72',
  password : '1989368d',
  database : 'joke_db_simon'
};

/*var localDbInfo = {
  connectionLimit : 3,
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'musicSharing'
};*/

router.get('/', function(req, res, next) {
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
    res.render('playlists',{playlists: allPlaylists, username: req.session.username});
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
    var allTracks = new Array();
    for(var i=0; i<results.length; i++){
      var track={};
      track.id = results[i].trackId;
      track.name = results[i].trackName;
      track.url = results[i].trackURL;
      track.url = track.url.replace("<iframe ", "");
      track.url = track.url.replace("></iframe>", "");
      allTracks.push(track);
    }
    dbConnection.end();
    res.render('playlist',{tracks: allTracks,user: req.session.username});
  });
});

router.get('/newTrack', function(req,res,next){
  res.render('newTrack', {playlistId: req.session.currentPlaylist});
});

router.post('/newTrack',function(req,res,next){
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
    res.redirect('/admin/playlist/'+req.session.currentPlaylist);
  });
});

router.get('/delete/:id', function(req, res, next) {
  if (req.params.id) {
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

    dbConnection.query('DELETE FROM playlists WHERE playlistId=?',[req.params.id], function(err,results, fields) {
      if (err) {
        console.log("Error deleting playlist");
        throw err;
      }
       dbConnection.end();
       res.redirect('/admin');
    });
  }
});

router.get('/playlist/delete/:id', function(req, res, next) {
  if (req.params.id) {
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

    dbConnection.query('DELETE FROM tracks WHERE trackId=?',[req.params.id], function(err,results, fields) {
      if (err) {
        console.log("Error deleting song");
        throw err;
      }
       dbConnection.end();
       res.redirect('back');
    });
  }
});

module.exports = router;