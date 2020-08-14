const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Profile = db.profile;
const Role = db.role;
const HttpStatus = require('http-status-codes');

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { profile, user, role } = require("../models");

// Save User to Database
exports.register = async (req, res) => {

  // create transaction for users and profiles creation
  const transaction_user_profile = await db.sequelize.transaction();
  try {
    const current_user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    },{transaction: transaction_user_profile});
    const all_roles = await Role.findAll({
      where: {
        name: {
          [Op.or]: req.body.roles
        }
      }})
    if (req.body.roles) {
      await current_user.setRoles(all_roles, {transaction: transaction_user_profile}).catch( err => {throw err})
    } else {
      await current_user.setRoles([2], {transaction:transaction_user_profile}).catch(err => {throw err})
    }
    // profile's creation
    const current_profile = await Profile.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      numTel: req.body.numTel,
      ville: req.body.ville,
      pays: req.body.pays,
      numTel: req.body.numTel,
      metierActuel: req.body.metierActuel,
      anneesExperiences: req.body.anneesExperiences,
      niveauEtudes: req.body.niveauEtudes,
      diplomes: req.body.diplomes,
      specialisations: req.body.specialisations,
      codePostal: req.body.codePostal,
      societe: req.body.societe,
      userId: await current_user.id
    },{transaction: transaction_user_profile});
    await transaction_user_profile.commit();
    const response_roles = await current_user.getRoles()
    .then(roles =>{return roles})
    .catch(err => {throw err});
    res
            .status(HttpStatus.CREATED)
            .send({
              message: "successfully created",
              data: {
                user:{...current_user.dataValues},
                profile:{...current_profile.dataValues},
                roles:response_roles
              },
              error: false
          })
  } catch (err) {
    await transaction_user_profile.rollback();
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: err, error: true });
    console.log(">> Error while finding comment: ", err);
  }
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