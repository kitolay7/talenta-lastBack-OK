const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

const HttpStatus = require('http-status-codes');


checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send({
          message: "Failed! Username is already in use!",
          error: true
        });
      return;
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(HttpStatus.BAD_REQUEST).send({
          message: "Failed! Email is already in use!",
          error: true
        });
        return;
      }

      next();
    });
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    console.log(ROLES, req.body.roles[0])
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(HttpStatus.BAD_REQUEST).send({
          message: "Failed! Role does not exist = " + req.body.roles[i],
          error: true
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;
