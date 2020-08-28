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
  console.log(req.body)
  // create transaction for users and profiles creation
  const transaction_user_profile = await db.sequelize.transaction();
  try {
    const current_user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    }, { transaction: transaction_user_profile });
    const all_roles = await Role.findAll({
      where: {
        name: {
          [Op.or]: req.body.roles
        }
      }
    })
    if (req.body.roles) {
      await current_user.setRoles(all_roles, { transaction: transaction_user_profile }).catch(err => { throw err })
    } else {
      await current_user.setRoles([2], { transaction: transaction_user_profile }).catch(err => { throw err })
    }
    // profile's creation
    const current_profile = await Profile.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      numTel: req.body.numTel,
      ville: req.body.ville,
      pays: req.body.pays,
      metierActuel: req.body.metierActuel,
      anneesExperiences: req.body.anneesExperiences,
      niveauEtudes: req.body.niveauEtudes,
      diplomes: req.body.diplomes,
      specialisations: req.body.specialisations,
      codePostal: req.body.codePostal,
      societe: req.body.societe,
      userId: await current_user.id
    }, { transaction: transaction_user_profile });
    await transaction_user_profile.commit();
    const response_roles = await current_user.getRoles()
      .then(roles => { return roles })
      .catch(err => { throw err });
    var token = jwt.sign({ id: current_user.id }, config.secret, {
      expiresIn: 86400 // 24 hours
    });
    res
      .status(HttpStatus.CREATED)
      .send({
        message: "successfully created",
        data: {
          user: { ...current_user.dataValues },
          profile: { ...current_profile.dataValues },
          roles: response_roles
        },
        accessToken: token,
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

// Update Profile to Database
exports.updateProfile = async (req, res) => {
  console.log(req + 'azearzetzeraert')
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  
  Profile.findOne({
    where: {
      id:req.body.userId
    }
  }).then (current_user => {
  	console.log(current_user)
    if (current_user === null) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send({ message: "User Not found.", error: true });
    } else {
    
  		//console.log(req.params + 'ballbalfzhelzhglz');
  		const date = new Date("2020-08-26 08:13:02");
  		const id = req.body.userId;
  		// create transaction for profiles update
  		const transaction_user_profile = await db.sequelize.transaction();
  		try {
    		const current_user = await User.update({
      		updatedAt: date,
    		}, {where: {id: id} }, { transaction: transaction_user_profile });
    		console.log(current_user.updatedAt + 'qskjfghqlkjghqr')
    		// profile's update
    		const current_profile = await Profile.update({
      		firstName: req.body.firstName,
      		lastName: req.body.lastName,
      		numTel: req.body.numTel,
      		ville: req.body.ville,
      		pays: req.body.pays,
      		metierActuel: req.body.metierActuel,
      		anneesExperiences: req.body.anneesExperiences,
      		niveauEtudes: req.body.niveauEtudes,
      		diplomes: req.body.diplomes,
      		specialisations: req.body.specialisations,
      		codePostal: req.body.codePostal,
      		societe: req.body.societe,
      		userId: await id
    		}, {where: {id: id} }, { transaction: transaction_user_profile });
    		await transaction_user_profile.commit();
    		
    		var token = jwt.sign({ id: id }, config.secret, {
      		expiresIn: 86400 // 24 hours
    		});
    		res
      		.status(HttpStatus.CREATED)
      		.send({
        		message: "successfully update",
        		error: false
      		})
  		} catch (err) {
    		await transaction_user_profile.rollback();
    		res
      		.status(HttpStatus.INTERNAL_SERVER_ERROR)
      		.send({ message: err, error: true });
    		console.log(">> Error while finding comment: ", err);
  		}
    }
  }
};
