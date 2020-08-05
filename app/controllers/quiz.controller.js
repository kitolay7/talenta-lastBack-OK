const db = require("../models");
const Quiz = db.quiz;
const question = db.question;
const Reponse = db.reponse;
const Op = db.Sequelize.Op;

const HttpStatus = require('http-status-codes');

exports.create = (req, res) => {
    if (!req.body.name) {
        res
            .status(HttpStatus.BAD_REQUEST)
            .send({
                message: "Content can not be empty!",
                error: true
            });
        return;
    }
    const quest = {
        name: req.body.name,
        type: req.body.type,
        offreId: req.body.offreId,
        // userId: req.body.userId
    };
    question.create(quest)
        .then(data => {
            console.log(data)
            res
                .status(HttpStatus.CREATED)
                .send({ message: data });
            return data;
        })
        .catch(err => {
            res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send({
                    message: err.message || "Some error occurred while creating the Quiz.",
                    error: true
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
            res
                .status(HttpStatus.CREATED)
                .send({ message: reponse, error: false });
            return reponse;
        })
        .catch((err) => {
            console.log(">> Error while creating comment: ", err);
            res
                .status(HttpStatus.BAD_REQUEST)
                .send({ message: err, error: true });
        });
};
exports.findQuestionbyId = (req, res, next) => {
    return question.findByPk(req.params.id, { include: ["options"] })
        .then((data) => {
            res
                .status(HttpStatus.OK)
                .send({ data: data, error: false });
            return data;
        })
        .catch((err) => {
            console.log(">> Error while finding comment: ", err);
            res
                .status(HttpStatus.NOT_FOUND)
                .send({ data: data, error: true });
        });
};