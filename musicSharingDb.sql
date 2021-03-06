create database musicSharing;

USE musicSharing;

CREATE TABLE users(
  userId INT PRIMARY KEY AUTO_INCREMENT,
  userDisplayName VARCHAR(45) NOT NULL UNIQUE,
  userPassword VARCHAR(45) NOT NULL
);

CREATE TABLE playlists(
  playlistId INT PRIMARY KEY AUTO_INCREMENT,
  playlistName VARCHAR(45) NOT NULL,
  userId INT,
  FOREIGN KEY (userId)
  REFERENCES users(userId)
);

CREATE TABLE tracks(
  trackId INT PRIMARY KEY AUTO_INCREMENT,
  trackName VARCHAR(45) NOT NULL,
  trackURL VARCHAR(500) NOT NULL,
  playlistId INT,
  FOREIGN KEY (playlistId)
  REFERENCES playlists(playlistId)
);


select * from tracks;
select * from users;
select * from playlists;