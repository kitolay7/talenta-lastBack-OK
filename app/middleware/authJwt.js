const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

const HttpStatus = require('http-status-codes');


verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res
      .status(HttpStatus.FORBIDDEN)
      .send({
        message: "No token provided!",
        error: true
      });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res
        .send({
          message: "Unauthorized!",
          error: true
        });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res
        .send({
          message: "Require Admin Role!",
          error: true
        });
      return;
    });
  });
};

isModerator = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "recruteur") {
          next();
          return;
        }
      }

      res
        .status(HttpStatus.FORBIDDEN)
        .send({
          message: "Require Rectuteur Role!",
          error: true
        });
    });
  });
};

isModeratorOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }

        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(HttpStatus.FORBIDDEN).send({
        message: "Require Moderator or Admin Role!",
        error: true
      });
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin
};
module.exports = authJwt;
