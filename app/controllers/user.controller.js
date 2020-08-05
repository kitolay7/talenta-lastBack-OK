const HttpStatus = require('http-status-codes');
const db = require("../models");
const User = db.user;


exports.allAccess = (req, res) => {
  res
    .status(HttpStatus.OK)
    .send({ message: "Public Content.", error: false });
};

// exports.userBoard = (req, res) => {
//   res
//     .status(HttpStatus.OK)
//     .send({ message: "User Content.", error: false });
// };

exports.userBoard = (req, res) => {
  const user = User.findOne({
    where: {
      id: req.body.id
    }
  })
    .then((current_user) => {
      if (current_user === null) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send({ message: "User Not found.", error: true });
      }

      var authorities = [];
      current_user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res
          .status(HttpStatus.OK)
          .send({
            id: current_user.id,
            username: current_user.username,
            email: current_user.email,
            roles: authorities,
            numTel: current_user.numTel,
            pays: current_user.pays,
            codePostal: current_user.codePostal,
            societe: current_user.societe,
            error: false
          });
      })
        .catch(err => {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message, error: true });
        });
    })

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
