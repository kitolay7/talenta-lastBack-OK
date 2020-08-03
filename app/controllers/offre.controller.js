const db = require("../models");

const fs = require('fs');
const Quiz = db.quiz;
const offres = db.offre;
const Reponse = db.reponse;
const Op = db.Sequelize.Op;
exports.createOffre = (req, res) => {
    const offre = {
        titre: req.body.titre,
        description: req.body.description,
        contexte: req.body.contexte,
        missions: req.body.missions,
        qualification: req.body.qualification,
        messages: req.body.messages,
        logo: req.files.logo[0].filename,
        video: req.files.video[0].filename,
    };
    console.log(req.body)
    offres.create(offre).then((reponse) => {
        console.log(">> Created OFfre: " + JSON.stringify(reponse));
        res.send({ message: reponse });
        return reponse;
    })
    .catch((err) => {
        console.log(">> Error while creating comment: ", err);
    });

};
exports.getOfferById = (req, res) => {
    return offres.findByPk(req.params.id, { include: ["questions"] })
    .then((data) => {
        res.send({ data: data });
      return data;
    })
    .catch((err) => {
      console.log(">> Error while finding comment: ", err);
    });
}