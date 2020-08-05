const db = require("../models");
const HttpStatus = require('http-status-codes');


const fs = require('fs');
const Quiz = db.quiz;
const offres = db.offre;
const Reponse = db.reponse;
const Op = db.Sequelize.Op;
exports.createOffre = (req, res) => {
    console.log(req.files)
    const offre = {
        titre: req.body.titre,
        description: req.body.description,
        contexte: req.body.contexte,
        missions: req.body.missions,
        qualification: req.body.qualification,
        messages: req.body.messages,
        publier: req.body.publier,
        logo: req.files.logo[0].filename,
        video: req.files.video[0].filename,
    };
    console.log(req.body)
    offres.create(offre).then((reponse) => {
        console.log(">> Created OFfre: " + JSON.stringify(reponse));
        res
            .status(HttpStatus.CREATED)
            .send({ message: reponse, error: false });
        return reponse;
    })
        .catch((err) => {
            console.log(">> Error while creating comment: ", err);
            res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send({ message: err, error: true });
        });

};
exports.getOfferById = (req, res) => {
    return offres.findByPk(req.params.id, { include: ["questions"] })
        .then((data) => {
            console.log(data.get({ publier: false }))
            res
                .status(HttpStatus.OK)
                .send({ data: data, error: false });
            return data;
            // NOT FOUND
        })
        .catch((err) => {
            res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send({ message: err, error: true });
            console.log(">> Error while finding comment: ", err);
        });
}
exports.findAllPublished = (req, res) => {
    offres.findAll({ where: { publier: true } })
        .then(data => {
            res
                .status(HttpStatus.OK)
                .send(data);
        })
        .catch(err => {
            res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send({
                    message:
                        err.message || "Some error occurred while retrieving tutorials.",
                    error: true
                });
        });
};
