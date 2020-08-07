const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const HttpStatus = require('http-status-codes');

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.register = (req, res) => {
  // Save User to Database
  console.log(req.body.roles)
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    societe: req.body.societe,
    codePostal: req.body.codePostal,
    pays: req.body.pays,
    numTel: req.body.numTel,
  })
    .then(user => {
      // console.log(user, req.body)
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res
              .status(HttpStatus.CREATED)
              .send({ message: "User registered successfully!", error: false });
          });
        });
      } else {
        // user role = 1
        user.setRoles([2]).then(() => {
          res
            .status(HttpStatus.CREATED)
            .send({ message: "User registered successfully!", error: false });
        });
      }
    })
    .catch(err => {
      res.send({ message: err.message, error: HttpStatus.INTERNAL_SERVER_ERROR });
    });
};

exports.signin = (req, res) => {
  console.log(`\n\n\n${req.body}\n\n\n`);
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send({ message: "User Not found.", error: true });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res
          .send({
            accessToken: null,
            message: "Invalid Password!",
            error: HttpStatus.UNAUTHORIZED
          });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res
          .status(HttpStatus.OK)
          .send({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
            numTel: user.numTel,
            pays: user.pays,
            codePostal: user.codePostal,
            societe: user.societe,
            accessToken: token,
            error: false
          });
      });
    })
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message, error: true });
    });
};
