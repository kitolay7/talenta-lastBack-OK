const db = require("../models");
const Quiz = db.quiz;
const question = db.question;
const Reponse = db.reponse;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    const quest = {
        name: req.body.name,
        type: req.body.type,
    };
    question.create(quest)
        .then(data => {
            console.log(data)
            return data;
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Quiz."
            });
        });
};
exports.findAll = (req, res) => {

};

exports.findOne = (req, res) => {

};

exports.update = (req, res) => {

};

exports.delete = (req, res) => {

};

exports.deleteAll = (req, res) => {

};

exports.findAllPublished = (req, res) => {

}
exports.createReponse = (req, res) => {
    return Reponse.create({
        name: req.body.name,
        isAnswer: req.body.isAnswer,
        questionId: req.body.questionId,
    })
        .then((reponse) => {
            console.log(">> Created comment: " + JSON.stringify(reponse));
            res.send({ message: reponse });
            return reponse;
        })
        .catch((err) => {
            console.log(">> Error while creating comment: ", err);
        });
};