const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Profile = db.profile;
const Role = db.role;
const HttpStatus = require('http-status-codes');
const { sendMail } = require("../middleware");

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
      expiresIn: 864000 // 24 hours
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
        expiresIn: 864000 // 24 hours
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
    }
  })
    
  const id = req.body.userId;
  try {
   Profile.update({
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
    }, {where: {id: id} });;
    res
      .send({
        message: "successfully update",
        error: false
      })
  } catch (err) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: err, error: true });
    console.log(">> Error while finding comment: ", err);
  }
    
  
};


// ********** ESSAI CONFIRM MAIL ***************

exports.log = async (req, res) => {

  console.log(req.body)
  
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
      if (!user.confirmed) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send({ message: "Confirmez votre email", error: true });
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
        expiresIn: 864000 // 24 hours
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

//

exports.reg = async (req, res) => {

  console.log(req.body)
  
  try {
    const current_user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    
    var token = jwt.sign({ id: current_user.id }, config.secret, {
      expiresIn: 864000 // 24 hours
    });
    
    console.log(token)
    
    const url = `http://localhost:4200/confirmation/${token}`
    
    const mail = {
    	body: {
    		email_recipient: req.body.email,
    		email_subject: 'Confirm email',
    		email_content: `Please click this url to confirm your email address : <a href="${url}">${url}</a>`
    	}
    }
    
    sendMail(mail, res, {});
    
    res
      .status(HttpStatus.CREATED)
      .send({
        message: "successfully created",
        data: {
          user: { ...current_user.dataValues },
        },
        accessToken: token,
        error: false
      })
  } catch (err) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: err, error: true });
    console.log(">> Error while finding comment: ", err);
  }
};

//

exports.confirm = async (req, res) => {
	console.log(req);
  	try {
  		const {user: {id} } = jwt.verify(req.param.token, config.secret);
  		await User.update({confirmed: true}, {where: {id}});
  	} catch (e) {
  		res.send('Error')
  	}
};


  	
