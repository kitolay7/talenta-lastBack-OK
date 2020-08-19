const HttpStatus = require('http-status-codes');
const db = require("../models");
const User = db.user;


exports.allAccess = (req, res) => {
  res
    .status(HttpStatus.OK)
    .send({ message: "Public Content.", error: false });
};

 exports.userBoard = (req, res) => {   res     .status(HttpStatus.OK)
    .send({ message: "User Content.", error: false });
 };



exports.adminBoard = (req, res) => {
  res
    .status(HttpStatus.OK)
    .send({ message: "Admin Content.", error: false });
};

exports.moderatorBoard = (req, res) => {
  res
    .status(HttpStatus.OK)
    .send("Moderator Content.");
};
