const HttpStatus = require('http-status-codes');
const db = require("../models");
const { reponse } = require('../models');
const User = db.user;
const Profile = db.profile;
const bcrypt = require("bcryptjs");



exports.allAccess = (req, res) => {
  res
    .status(HttpStatus.OK)
    .send({ message: "Public Content.", error: false });
};

 exports.userBoard = (req, res) => {
   res
     .status(HttpStatus.OK)
     .send({ message: "User Content.", error: false });
 }; 
exports.userInfo = (req, res) => {

User.findOne({
    where: {
      id: req.params.idUser
    },
  })
    .then((current_user) => {
      // console.log(current_user)
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
        Profile.findOne({
          where: {
            userId:req.params.idUser
          }
        }).then ((response) => {
          // console.log(response)
          res
          .status(HttpStatus.OK)
          .send({
            id: current_user.id,
            username: current_user.username,
            email: current_user.email,
            roles: authorities,
            numTel: response.numTel,
            pays: response.pays,
            codePostal: response.codePostal,
            societe: response.societe,
            metier: response.metierActuel,
            anneesExperiences: response.anneesExperiences,
            niveauEtudes: response.niveauEtudes,
            diplomes: response.diplomes,
            specialisations: reponse.specialisations,
            profile: response,
            error: false,
            profile_photo_path: current_user.profile_photo_path

          });
      })
        .catch(err => {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message, error: true });
        });
        })

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

exports.updateUserRecruteur = (req,res) => {
  console.log(req.files);
  try {
    User.findOne({
      where: {
        id: req.params.id
      }
    }).then(user => {
      if(!user){
        res
          .status(HttpStatus.NOT_FOUND)
          .send({ message: "User Not found.", error: true });
      }
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (passwordIsValid) {
        User.update({
          username: req.body.username,
          email: req.body.email,
          numTel: req.body.numTel,
          codePostal: req.body.codePostal,
          societe: req.body.societe,
          pays: req.body.pays,
          profile_photo_path: req.files.logo[0].filename
        },{
          where:{
            id: req.params.id
        },
          })
          .then(() => {
            res.status(HttpStatus.OK).json({
              message: "user's profile updated",
              error: false
            })
          })
          .catch((error) => {
            res.status(HttpStatus.NOT_MODIFIED).json({
              other: "user's profile isn't updated",
              error: true
            })
           });
        }
        else{
          res.status(HttpStatus.NOT_ACCEPTABLE).json({
              password: "Mot de passe incorrect",
              error: true
          })
        }
      })
    }
    catch(error){
      
    }
   
  
}

exports.updateUserPhoto = (req,res) => {

}