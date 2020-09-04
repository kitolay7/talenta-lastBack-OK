const db = require("../models");
const Quiz = db.quiz;
const Offre = db.offre;
const Dossier = db.dossier;
const CriteriaPointQuestion = db.criteria_point_question;
const Question = db.question;
const Reponse = db.reponse;
const Op = db.Sequelize.Op;

const HttpStatus = require('http-status-codes');
const { response } = require("express");
const options = require("dotenv/lib/env-options");

exports.create = async (req, res) => {
    // offres id
    const transaction_quiz = await db.sequelize.transaction();
    try{
        const quiz = await Quiz.create({name:req.body.name,fiche_dir:req.body.fiche_dir,author_dir:req.body.author_dir,offreId:req.body.offer});
        const offre = await Offre.findByPk(quiz.offreId).catch(error => {throw error});
        Quiz.update({userId:offre.userId},{where:{id:quiz.id}}).catch(error => {throw error});
        const dossier = await Dossier.create({titre:offre.titre,fiche:req.body.fiche_dir,auteur:req.body.author_dir,offreId:offre.id,userId: offre.userId}).catch(error => {throw error}); 
        const listTrueOrFalseRequest = req.body.listTrueOrFalse || null;
        for(const questionTrueFalseRequest of listTrueOrFalseRequest) {
            let questionTrueFalseResponse = await Question.create(questionTrueFalseRequest,{transaction_quiz}).catch(error => {throw error});
            for( const critere of questionTrueFalseRequest.criteres) {
                const newCritere = {...critere,...{questionId:questionTrueFalseResponse.id}};
                await CriteriaPointQuestion.create(newCritere,{transaction_quiz}).catch(error => {throw error});
            };
            // console.log(`\n\n${JSON.stringify(questionTrueFalseRequest.responses)}\n\n`);
            await Reponse.create({isAnswers:questionTrueFalseRequest.responses.isAnswers[0], questionId:questionTrueFalseResponse.id},{transaction_quiz}).catch(error => {throw error});
        };
        const listMultipleRequest = req.body.listMultiple || null;
        for(const questionMultipleRequest of listMultipleRequest) 
        {
            let questionMultipleResponse = await Question.create(questionMultipleRequest,{transaction_quiz}).catch(error => {throw error});
            for( const critere of questionMultipleRequest.criteres) 
            {
                const newCritere = {...critere,...{questionId:questionMultipleResponse.id}};
                await CriteriaPointQuestion.create(newCritere,{transaction_quiz}).catch(error => {throw error});
                    for(index=0;index<questionMultipleRequest.responses.choices.length;index++)
                    {
                        await Reponse.create({choices:questionMultipleRequest.responses.choices[index],isAnswers:questionMultipleRequest.responses.isAnswers[index], questionId:questionMultipleResponse.id},{transaction_quiz}).catch(error => {throw error});
                    }
            }
        }
        const listClassementRequest = req.body.listClassement || null;
        for(const questionClassementRequest of listClassementRequest) {
            // console.log(`\n\n${JSON.stringify(questionClassementRequest)}\n\n`);
            let questionClassementResponse = await Question.create(questionClassementRequest,{transaction_quiz}).catch(error => {throw error});
            for(const critere of questionClassementRequest.criteres) {
                const newCritere = {...critere,...{questionId:questionClassementResponse.id}};
                await CriteriaPointQuestion.create(newCritere,{transaction_quiz}).catch(error => {throw error});
                for(index=0;index<questionClassementRequest.responses.choices.length; index++) {                                        
                    // await Reponse.create({choices:questionClassementRequest.responses.choices[index],rang:questionClassementRequest.responses.rang[index], questionId:questionClassementResponse.id},{transaction_quiz}).catch(error => {throw error});
                    await Reponse.create({choices:questionClassementRequest.responses.choices[index], rang:index, questionId:questionClassementResponse.id},{transaction_quiz}).catch(error => {throw error});
                }
            }
        };
        const listRedactionRequest = req.body.listRedaction || null;
        for(const questionRedactionRequest of listRedactionRequest) {
            // console.log(`\n\n${JSON.stringify(questionRedactionRequest)}\n\n`);
            let questionRedactionResponse = await Question.create(questionRedactionRequest,{transaction_quiz}).catch(error => {throw error});
            for(critere of questionRedactionRequest.criteres) {
                const newCritere = {...critere,...{questionId:questionRedactionResponse.id}};
                await CriteriaPointQuestion.create(newCritere,{transaction_quiz}).catch(error => {throw error});
            } 
            for(index=0;index<questionRedactionRequest.responses.choices.length;index++){    
                await Reponse.create({choices:questionRedactionRequest.responses.choices[index],isAnswers:questionRedactionRequest.responses.isAnswers[index], questionId:questionRedactionResponse.id},{transaction_quiz}).catch(error => {throw error});
            }
        }
        console.log(req.body.listAudio);
        const listAudio = req.body.listAudio || null;
        for(const questionAudioRequest of listAudio){
            // console.log(`\n\n${JSON.stringify(questionRedactionRequest)}\n\n`);
            let questionAudioResponse = await Question.create(questionAudioRequest,{transaction_quiz}).catch(error => {throw error});
            for((critere) of questionAudioRequest.criteres){
                const newCritere = {...critere,...{questionId:questionAudioResponse.id}};
                await CriteriaPointQuestion.create(newCritere,{transaction_quiz}).catch(error => {throw error});
            };
            await Reponse.create({type_audio:questionAudioRequest.responses.type_audio, questionId:questionAudioResponse.id},{transaction_quiz}).catch(error => {throw error});
        }
        const listVideo = req.body.listVideo || null;
        for(const questionVideoRequest of listVideo){
            console.log(`\n\n${JSON.stringify(questionVideoRequest)}\n\n`);
            let questionVideoResponse = await Question.create(questionVideoRequest,{transaction_quiz}).catch(error => {throw error});
            console.log(JSON.stringify(questionVideoResponse));
            for((critere) of questionVideoRequest.criteres){
                const newCritere = {...critere,...{questionId:questionVideoResponse.id}};
                await CriteriaPointQuestion.create(newCritere,{transaction_quiz}).catch(error => {throw error});
            };
            await Reponse.create({type_audio:questionVideoRequest.responses.type_audio, questionId:questionVideoResponse.id},{transaction_quiz}).catch(error => {throw error});
        }


        await transaction_quiz.commit();
        res
        .status(HttpStatus.OK)
        .send({
            message: "Test créé avec succès",
            error: false
        });
        // console.log(`\n${req.body.quiz.offreId}\n`);
    }
    catch(error){
        await transaction_quiz.rollback();
        res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({
            message: error.message || "Some error occurred while creating the Quiz.",
            error: true
        });
    }
};
exports.findAll = (req, res) => {

};

exports.findOne = (req, res) => {
  return Question.findAll({
    where: {
      offreId: req.params.id,
    },
    include: ["options"]
  })
        .then((data) => {
            res
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



exports.findOneByOffer = async (req, res) => {
    console.log(`OFFFER ID ${JSON.stringify(req.body)}`);
    const current_quiz = await Quiz.findOne({
        where: {offreId:req.params.id},
        include:[
            {
                model: db.offre,
                include:[
                    {
                        model:Question, as: "questions",
                        include:[
                            {model: db.criteria_point_question},
                            {model: db.reponse, as:"options"},
                        ]
                    }
                ]
            }
        ]
    })
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
    })
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
    return Question.findByPk(req.params.id, { include: ["options"] })
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