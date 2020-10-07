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
require('dotenv/config');

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
    console.log(token)
    const roleId = (req.body.roles.includes('ROLE_RECRUTEUR')) ? 1 : 2 ;
    const url = `http://${req.headers.host}/confirmation/${token}/${roleId}`
    
    const mail = {
      body: {
        email_recipient: req.body.email,
        email_subject: `Confirmation d'adresse email pour Talenta Sourcing`,
        email_content: `Bonjour! :) 
        <br>
        <br>Veuillez cliquer sur ce lien pour valider votre adresse mail et votre compte : <a href="${url}">${url}</a>
        <br>
        <br>  
        L'équipe Talenta vous remercie de votre confiance. 
        <br>
        	***************************************************************************************************`
      }
    }

    sendMail(mail, res, {});

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
exports.signAdmin = (req, res) => {
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
        expiresIn: "4 days"
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
            accessToken: token,
            error: false
          });
      });
    })
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message, error: true });
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
          .send({ message: "Utilisateur non trouvé.", error: true });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res
          .send({
            accessToken: null,
            message: "Mot de passe invalide!",
            error: HttpStatus.UNAUTHORIZED
          });
      }

      if (!user.confirmed) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .send({ message: "Veuillez confirmer votre adresse email dans votre boite mail", error: true });
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
  console.log(req.body + 'azearzetzeraert')
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  try {
  	await User.findOne({
    	where: {
      		id: req.body.userId
    	}
  	}).then(current_user => {
    	console.log(current_user)
    	if (current_user === null) {
      	return res
        	.status(HttpStatus.NOT_FOUND)
        	.send({ message: "User Not found.", error: true });
    	}
  	})

  	const id = req.body.userId;
    await Profile.update({
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
    }, { where: { userId: id } })
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

exports.confirm = (req, res) => {
  const id = jwt.verify(req.params.token, config.secret);
  const url = req.headers.host.split(':')[0];
  User.update({ confirmed: true }, { where: { id: id.id } })
  .then(resultat => {
    
     if (req.params.role === 1) {
   			return res.redirect(`http://${url}:4200/candidat/registration`);
 		} else {
   			return res.redirect(`http://${url}:4200/recruteur/registration`);
 		}
  }).catch(err => { throw err });


};

exports.editPW = (req, res) => {
  console.log(`\n\n\n${req.body}\n\n\n`);
  User.findOne({
    where: {
      id: req.body.id
    }
  })
    .then(user => {
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res
          .send({
            error: true,
            message: "Invalid Password!",
          });
      } else {
      User.update({
        password: bcrypt.hashSync(req.body.newPw, 8)

      }, { where: { id: req.body.id } })
        res
        .send({ message: 'mot de passe modifier', error: false });
      }
    })
};

exports.forgotPW = (req, res) => {
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
      
    	var token = jwt.sign({ id: user.id }, config.secret, {
      		expiresIn: 864000 // 24 hours
    	});
    	console.log(token)
    	const url = `${req.headers.origin}/user/reset/${token}`
    	
    	const mail = {
      		body: {
        		email_recipient: req.body.email,
        		email_subject: `Réinitialisation de mot de passe pour Talenta Sourcing`,
        		email_content: `Bonjour! :) 
        		<br>
        		<br>Veuillez cliquer sur ce lien pour réinitialiser votre mot de passe : <a href="${url}">${url}</a>
        		<br>
        		<br>  
        		L'équipe Talenta vous remercie de votre confiance. 
        		<br>
        	***************************************************************************************************`
      		}
    	}
	
    	sendMail(mail, res, {});
	
        res
          .status(HttpStatus.OK)
          .send({
            id: user.id,
            error: false
          });
      });
};
exports.checkReset = async (req, res) => {
  // console.log(req.headers.origin);
  try {
    const id = jwt.verify(req.params.token, config.secret);
  	//console.log(id);
    await User.findOne({
    	where: {
      		id: id.id
    	}
  	})
    .then(user => {
      	if (!user) {
        	res
          		.status(HttpStatus.NOT_FOUND)
          		.send({ 
          			message: "User Not found.",
          			error: true })
      	} else {

        	res
          		.status(HttpStatus.OK)
          		.send({
          			data: user,
            		error: false
          		})
        }
    })
    .catch(err => { throw err })
    
  } catch (e) {
    console.log(e);
    res
    	.send({
          		access: "error",
            	error: true
          	})
  }
};
exports.contact = async (req, res) => {
  	//console.log(`\n\n\n${req}\n\n\n`);
    
    const mail = {
      	body: {
        	email_recipient: process.env.FROM_EMAIL,
        	email_subject: `Talenta Sourcing - Message vennant d'un client`,
        	email_content: `Message vennant de ${req.body.nom} - (${req.body.email})
        		<br>
        		<br>
        		<br>
        		<u>Objet </u>: ${req.body.objet}
        		<br>
        		<br> 
        		${req.body.message}
        		<br> 
        		<br> 
        		
        	***************************************************************************************************`
      	}
    }
    //console.log(`\n\n\n${mail}\n\n\n`);
    const reponse = {
      	body: {        	
        	email_recipient: req.body.email,
        	email_subject: `Talenta Sourcing - Réponse à votre message`,
        	email_content: `Bonjour! 
        		<br>
        		Talenta Sourcing a bien reçu votre message. Nous vous contacterons ultérieurement le plus vite possible. 
        		<br> 
        		N'hésitez pas à nous contacter via notre adresse email ou au numero 030 00 000 00 si vous avez d'autres recommandations.
        		<br> 
        		<br>  
        		L'équipe Talenta vous remercie de votre confiance. 
        		<br>
        		<br> 
        	***************************************************************************************************`
      	}
    }
    //console.log(`\n\n\n${reponse}\n\n\n`);
    try {
	
    	await sendMail(mail, res, {});
    	await sendMail(reponse, res, {});
	
    	res
        	.status(HttpStatus.OK)
        	.send({
        		error: false
        	});
    } catch (e) {
    	console.log(e);
    	res
    		.send({
          			access: "error",
            		error: true
          		})
    }
};
