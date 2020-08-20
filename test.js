const db = require("../models");
const Quiz = db.quiz;
const Offre = db.offre;
const CriteriaPointQuestion = db.criteria_point_question;
const Question = db.question;
const Reponse = db.reponse;
const Op = db.Sequelize.Op;

const HttpStatus = require('http-status-codes');
const { response } = require("express");

exports.create = async (req, res) => {
    // offres id
    const transaction_quiz = await db.sequelize.transaction();
    try{
        const quizz = await Quiz.create({offerId: req.body.offer,name:req.body.name,fiche_dir:req.body.fiche_dir,author_dir:req.body.author_dir},{transaction: transaction_quiz});
        const offre = await Offre.findByPk(req.body.offer).catch(error => {throw error});
        const listTrueOrFalseRequest = req.body.listTrueOrFalse || null;
        listTrueOrFalseRequest && listTrueOrFalseRequest.forEach(async(questionTrueFalseRequest) => {
            let questionTrueFalseResponse = await Question.create(questionTrueFalseRequest,{transaction_quiz}).catch(error => {throw error});
            questionTrueFalseRequest.criteres && questionTrueFalseRequest.criteres.forEach(async (critere) => {
                const newCritere = {...critere,...{questionId:questionTrueFalseResponse.id}};
                await CriteriaPointQuestion.create(newCritere,{transaction_quiz}).catch(error => {throw error});
            });
            // console.log(`\n\n${JSON.stringify(questionTrueFalseRequest.responses)}\n\n`);
            questionTrueFalseRequest.responses && questionTrueFalseRequest.responses.isAnswers[0] &&
            await Reponse.create({isAnswers:questionTrueFalseRequest.responses.isAnswers[0], questionId:questionTrueFalseResponse.id},{transaction_quiz}).catch(error => {throw error});
        });
        const listMultipleRequest = req.body.listMultiple || null;
        listMultipleRequest && listMultipleRequest.forEach(async (questionMultipleRequest) => {
            let questionMultipleResponse = await Question.create(questionMultipleRequest,{transaction_quiz}).catch(error => {throw error});
            questionMultipleRequest.criteres && questionMultipleRequest.criteres.forEach( async(critere) => {
                const newCritere = {...critere,...{questionId:questionMultipleResponse.id}};
                await CriteriaPointQuestion.create(newCritere,{transaction_quiz}).catch(error => {throw error});
                questionMultipleRequest.responses && questionMultipleRequest.responses.choices.forEach(async (response, index) => {                                        
                    await Reponse.create({choices:questionMultipleRequest.responses.choices[index],isAnswers:questionMultipleRequest.responses.isAnswers[index], questionId:questionMultipleResponse.id},{transaction_quiz}).catch(error => {throw error});
                });
            });
        });
        const listClassementRequest = req.body.listClassement || null;
        listClassementRequest && listClassementRequest.forEach(async (questionClassementRequest) => {
            // console.log(`\n\n${JSON.stringify(questionClassementRequest)}\n\n`);
            let questionClassementResponse = await Question.create(questionClassementRequest,{transaction_quiz}).catch(error => {throw error});
            questionClassementRequest.criteres && questionClassementRequest.criteres.forEach(async (critere) => {
                const newCritere = {...critere,...{questionId:questionClassementResponse.id}};
                await CriteriaPointQuestion.create(newCritere,{transaction_quiz}).catch(error => {throw error});
                questionClassementRequest.responses && questionClassementRequest.responses.choices.forEach(async (response, index) => {                                        
                    await Reponse.create({choices:questionClassementRequest.responses.choices[index],rang:questionClassementRequest.responses.rang[index],isAnswers:questionClassementRequest.responses.isAnswers[index], questionId:questionClassementResponse.id},{transaction_quiz}).catch(error => {throw error});
                });
            });
        });
        const listRedactionRequest = req.body.listRedaction || null;
        listRedactionRequest && listRedactionRequest.forEach(async (questionRedactionRequest) => {
            // console.log(`\n\n${JSON.stringify(questionRedactionRequest)}\n\n`);
            let questionRedactionResponse = await Question.create(questionRedactionRequest,{transaction_quiz}).catch(error => {throw error});
            questionRedactionRequest.criteres && questionRedactionRequest.criteres.forEach(async (critere) => {
                const newCritere = {...critere,...{questionId:questionRedactionResponse.id}};
                await CriteriaPointQuestion.create(newCritere,{transaction_quiz}).catch(error => {throw error});
            }); 
            questionRedactionRequest.responses && questionRedactionRequest.responses.choices.forEach(async (response, index) => {                                        
                await Reponse.create({choices:questionRedactionRequest.responses.choices[index],isAnswers:questionRedactionRequest.responses.isAnswers[index], questionId:questionRedactionResponse.id},{transaction_quiz}).catch(error => {throw error});
            });
        });
        const listAudio = req.body.listAudio || null;
        listAudio && listAudio.forEach(async(questionAudioRequest) => {
            // console.log(`\n\n${JSON.stringify(questionRedactionRequest)}\n\n`);
            let questionAudioResponse = await Question.create(questionAudioRequest,{transaction_quiz}).catch(error => {throw error});
            questionAudioRequest.criteres && questionAudioRequest.criteres.forEach(async (critere) => {
                const newCritere = {...critere,...{questionId:questionAudioResponse.id}};
                await CriteriaPointQuestion.create(newCritere,{transaction_quiz}).catch(error => {throw error});
            });
            await Reponse.create({type_audio:questionAudioRequest.responses.type_audio, questionId:questionAudioResponse.id},{transaction_quiz}).catch(error => {throw error});
        });
        await transaction_quiz.commit();
        res
        .status(HttpStatus.OK)
        .send({
            ok: "Test créé avec succès",
            error: false
        });
        // console.log(`\n${req.body.quiz.offreId}\n`);
    }
    catch(error){
        await transaction_quiz.rollback();
        console.error(error);
        res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({
            message: error.message || "Some error occurred while creating the Quiz.",
            error: true
        });
    }
    // questions 1,2,3,4
    // user creator
    // criteria_point_question
    // response
    
    
    
    // if (!req.body.name) {
    //     res
    //         .status(HttpStatus.BAD_REQUEST)
    //         .send({
    //             message: "Content can not be empty!",
    //             error: true
    //         });
    //     return;
    // }
    // const quest = {
    //     name: req.body.name,
    //     type: req.body.type,
    //     offreId: req.body.offreId,
    //     // userId: req.body.userId
    // };
    // question.create(quest)
    //     .then(data => {
    //         console.log(data)
    //         res
    //             .status(HttpStatus.CREATED)
    //             .send({ message: data });
    //         return data;
    //     })
    //     .catch(err => {
            // res
            //     .status(HttpStatus.INTERNAL_SERVER_ERROR)
            //     .send({
            //         message: err.message || "Some error occurred while creating the Quiz.",
            //         error: true
            //     });
    //     });
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
        point: req.body.point,
        timer: req.body.timing,
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