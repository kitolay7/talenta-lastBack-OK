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
const { quiz } = require("../models");

exports.create = async (req, res) => {
    // offres id
    const transaction_quiz = await db.sequelize.transaction();
    try{
        const quiz = await Quiz.create({name:req.body.name,fiche_dir:req.body.fiche_dir,author_dir:req.body.author_dir,offreId:req.body.offer});
        const offre = await Offre.findByPk(quiz.offreId).catch(error => {throw error});
        Quiz.update({userId:offre.userId},{where:{id:quiz.id}}).catch(error => {throw error});
        // const dossier = await Dossier.create({titre:offre.titre,fiche:req.body.fiche_dir,auteur:req.body.author_dir,offreId:offre.id,userId: offre.userId}).catch(error => {throw error}); 
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

exports.updateQuizContent = async (req, res) => {
    try {
        const quizId = req.params.quizId;
        // True or False
        const listTrueOrFalseRequest = req.body.listTrueOrFalse || null;
        let questionTrueFalseResponse;
        for(const questionTrueFalseRequest of listTrueOrFalseRequest) {
            if (questionTrueFalseRequest.id && questionTrueFalseRequest.id !== null && questionTrueFalseRequest.id !== '') {                
                questionTrueFalseResponse = await Question.update(questionTrueFalseRequest,
                    {where:{id: questionTrueFalseRequest.id}
                }).catch(error => {throw error});
            }
            else{
                questionTrueFalseResponse = await Question.create(questionTrueFalseRequest)
                .catch(error => {throw error});
            }
            for( const critere of questionTrueFalseRequest.criteres) {
                const newCritere = {...critere,...{questionId:questionTrueFalseResponse.id}};
                if (newCritere.id && newCritere.id !== null && newCritere.id !== '' ) {                    
                    await CriteriaPointQuestion.update(newCritere,
                        {where:{id: newCritere.id }
                    }).catch(error => {throw error});
                }
                else{
                    await CriteriaPointQuestion.create(newCritere).catch(error => {throw error});
                }
            };
            // console.log(`\n\n${JSON.stringify(questionTrueFalseRequest.responses)}\n\n`);
            if (questionTrueFalseRequest.responses.id[0] && questionTrueFalseRequest.responses.id[0] !== null && questionTrueFalseRequest.responses.id[0] !== '' ) {
                await Reponse.update({isAnswers:questionTrueFalseRequest.responses.isAnswers[0], questionId:questionTrueFalseResponse.id},
                    {where: {id:questionTrueFalseRequest.responses.id[0]}});
            }
            else{
                await Reponse.create({isAnswers:questionTrueFalseRequest.responses.isAnswers[0], questionId:questionTrueFalseResponse.id});
            }
        }
        // Multiple
        const listMultipleRequest = req.body.listMultiple || null;
        let questionMultipleResponse;
        for(const questionMultipleRequest of listMultipleRequest) 
        {
            if (questionMultipleRequest.id && questionMultipleRequest.id !== null && questionMultipleRequest.id !== '') {
                questionMultipleResponse = await Question.update(questionMultipleRequest,
                    {where:{id: questionMultipleRequest.id}
                }).catch(error => {throw error});
            } else {
                questionMultipleResponse = await Question.create(questionMultipleRequest)
                .catch(error => {throw error});
            }
            const newCritere = questionMultipleRequest.criteres[0];
            if (newCritere.id && newCritere.id !== null && newCritere.id !== '') {
                await CriteriaPointQuestion.update(newCritere,
                    {where:{id: newCritere.id }
                }).catch(error => {throw error});
            } else {
                await CriteriaPointQuestion.create(newCritere).catch(error => {throw error});
            }
                for(index=0;index<questionMultipleRequest.responses.choices.length;index++)
                {
                    if (questionMultipleRequest.responses.id[index] && questionMultipleRequest.responses.id[index]!==null && questionMultipleRequest.responses.id[index]!=='' ) {
                        await Reponse.update({choices:questionMultipleRequest.responses.choices[index],isAnswers:questionMultipleRequest.responses.isAnswers[index], questionId:questionMultipleResponse.id},{where:{id:questionMultipleRequest.responses.id[index]}}).catch(error => {throw error});
                    } else {
                        await Reponse.create({choices:questionMultipleRequest.responses.choices[index],isAnswers:questionMultipleRequest.responses.isAnswers[index], questionId:questionMultipleResponse.id}).catch(error => {throw error});
                    }
                }
        }

        // classement
        const listClassementRequest = req.body.listClassement || null;
        let questionClassementResponse;
        for(const questionClassementRequest of listClassementRequest) {
            if (questionClassementRequest.id && questionClassementRequest.id !== null && questionClassementRequest.id!=='') {
                questionClassementResponse = await Question.update(questionClassementRequest,
                    {where:{id:questionClassementRequest.id}
                })
                .catch(error => {throw error});
            } else {
                questionClassementResponse = await Question.create(questionClassementRequest)
                .catch(error => {throw error});
            }
            const newCritere = questionClassementRequest.criteres[0];
            console.log(`\n\n${newCritere}\n\n`);
            if (newCritere.id && newCritere.id !== null && newCritere.id !== '') {
                await CriteriaPointQuestion.update(newCritere,
                    {where:{id: newCritere.id }
                })
                .catch(error => {throw error});
            } else {
                await CriteriaPointQuestion.create(newCritere).catch(error => {throw error});
            }
                for(index=0;index<questionClassementRequest.responses.choices.length; index++) {                                        
                    if (questionClassementRequest.responses.id[index] && questionClassementRequest.responses.id[index]!==null && questionClassementRequest.responses.id[index]!=='' ) {
                        await Reponse.update({choices:questionClassementRequest.responses.choices[index], rang:index, questionId:questionClassementResponse.id},{where:{id:questionClassementRequest.responses.id[index]}})
                        .catch(error => {throw error});
                    }
                    else{
                        await Reponse.create({choices:questionClassementRequest.responses.choices[index], rang:index, questionId:questionClassementResponse.id})
                        .catch(error => {throw error});
                    }
                }
        };
        // redaction
        const listRedactionRequest = req.body.listRedaction || null;
        let questionRedactionResponse;
        for(const questionRedactionRequest of listRedactionRequest) {
            if (questionRedactionRequest.id && questionRedactionRequest.id !== null && questionRedactionRequest.id !== '') {
                questionRedactionResponse = await Question.update(questionRedactionRequest,{where:{id:questionRedactionRequest.id}}).catch(error => {throw error});
            } else {
                questionRedactionResponse = await Question.create(questionRedactionRequest).catch(error => {throw error});
            }
            for(critere of questionRedactionRequest.criteres) {
                if (critere.id && critere.id !== null && critere.id !== '') {
                    await CriteriaPointQuestion.update(critere,{where:{id:critere.id}}).catch(error => {throw error});
                } else {
                    await CriteriaPointQuestion.create(critere).catch(error => {throw error});
                }
            }
            for(index=0;index<questionRedactionRequest.responses.choices.length;index++){
                if (questionRedactionRequest.responses.id[index] && questionRedactionRequest.responses.id[index] !== null && questionRedactionRequest.responses.id[index] !== '') {
                    await Reponse.update({choices:questionRedactionRequest.responses.choices[index],isAnswers:questionRedactionRequest.responses.isAnswers[index], questionId:questionRedactionResponse.id},{where:{id:questionRedactionRequest.responses.id[index]}}).catch(error => {throw error});
                } else {
                    await Reponse.create({choices:questionRedactionRequest.responses.choices[index],isAnswers:questionRedactionRequest.responses.isAnswers[index], questionId:questionRedactionResponse.id}).catch(error => {throw error});
                }    
            }
        }
        // audio
        const listAudio = req.body.listAudio || null;
        let questionAudioResponse;
        for(const questionAudioRequest of listAudio){
            if (questionAudioRequest.id && questionAudioRequest.id!==null && questionAudioRequest.id!=='') {
                questionAudioResponse = await Question.update(questionAudioRequest, {where:{id: questionAudioRequest.id}}).catch(error => {throw error});
            } else {
                questionAudioResponse = await Question.create(questionAudioRequest).catch(error => {throw error});
            }
            for(critere of questionAudioRequest.criteres) {
                if (critere.id && critere.id !== null && critere.id !== '') {
                    await CriteriaPointQuestion.update(critere,{where:{id:critere.id}}).catch(error => {throw error});
                } else {
                    await CriteriaPointQuestion.create(critere).catch(error => {throw error});
                }
            }
            for(index=0;index<questionAudioRequest.responses.id.length;index++){
                if (questionAudioRequest.responses.id[index] && questionAudioRequest.responses.id[index] !== null && questionAudioRequest.responses.id[index] !== '') {
                    await Reponse.update({type_audio:questionAudioRequest.responses.type_audio, questionId:questionAudioResponse.id},{where:{id:questionAudioRequest.responses.id[index]}}).catch(error => {throw error});
                } else {
                    await Reponse.create({type_audio:questionAudioRequest.responses.type_audio, questionId:questionAudioResponse.id}).catch(error => {throw error});
                }
            }
        }

        // video
        const listVideo = req.body.listVideo || null;
        let questionVideoResponse;
        for(const questionVideoRequest of listVideo){
            if (questionVideoRequest.id && questionVideoRequest.id!==null && questionVideoRequest.id!=='') {
                questionVideoResponse = await Question.update(questionVideoRequest, {where:{id: questionVideoRequest.id}}).catch(error => {throw error});
            } else {
                questionVideoResponse = await Question.create(questionVideoRequest).catch(error => {throw error});
            }
            for(critere of questionVideoRequest.criteres) {
                if (critere.id && critere.id !== null && critere.id !== '') {
                    await CriteriaPointQuestion.update(critere,{where:{id:critere.id}}).catch(error => {throw error});
                } else {
                    await CriteriaPointQuestion.create(critere).catch(error => {throw error});
                }
            }
            for(index=0;index<questionVideoRequest.responses.id.length;index++){
                if (questionVideoRequest.responses.id[index] && questionVideoRequest.responses.id[index] !== null && questionVideoRequest.responses.id[index] !== '') {
                    await Reponse.update({type_audio:questionVideoRequest.responses.type_audio, questionId:questionVideoResponse.id},{where:{id:questionVideoRequest.responses.id[index]}}).catch(error => {throw error});
                } else {
                    await Reponse.create({type_audio:questionVideoRequest.responses.type_audio, questionId:questionVideoResponse.id}).catch(error => {throw error});
                }
            }
        }
        res
            .status(HttpStatus.OK)
            .send({message: "atr@farany",error:false});
        // console.log(`\n\n\n${JSON.stringify(listTrueOrFalseRequest)}\n\n\n`);
        
        // const listMultipleRequest = req.body.listMultiple || null;
        // for(const questionMultipleRequest of listMultipleRequest) 
        // {
        //     let questionMultipleResponse = await Question.create(questionMultipleRequest).catch(error => {throw error});
        //     for( const critere of questionMultipleRequest.criteres) 
        //     {
        //         const newCritere = {...critere,...{questionId:questionMultipleResponse.id}};
        //         await CriteriaPointQuestion.create(newCritere).catch(error => {throw error});
        //             for(index=0;index<questionMultipleRequest.responses.choices.length;index++)
        //             {
        //                 await Reponse.create({choices:questionMultipleRequest.responses.choices[index],isAnswers:questionMultipleRequest.responses.isAnswers[index], questionId:questionMultipleResponse.id}).catch(error => {throw error});
        //             }
        //     }
        // }
        // const listClassementRequest = req.body.listClassement || null;
        // for(const questionClassementRequest of listClassementRequest) {
        //     // console.log(`\n\n${JSON.stringify(questionClassementRequest)}\n\n`);
        //     let questionClassementResponse = await Question.create(questionClassementRequest).catch(error => {throw error});
        //     for(const critere of questionClassementRequest.criteres) {
        //         const newCritere = {...critere,...{questionId:questionClassementResponse.id}};
        //         await CriteriaPointQuestion.create(newCritere).catch(error => {throw error});
        //         for(index=0;index<questionClassementRequest.responses.choices.length; index++) {                                        
        //             // await Reponse.create({choices:questionClassementRequest.responses.choices[index],rang:questionClassementRequest.responses.rang[index], questionId:questionClassementResponse.id}).catch(error => {throw error});
        //             await Reponse.create({choices:questionClassementRequest.responses.choices[index], rang:index, questionId:questionClassementResponse.id}).catch(error => {throw error});
        //         }
        //     }
        // };
        // const listRedactionRequest = req.body.listRedaction || null;
        // for(const questionRedactionRequest of listRedactionRequest) {
        //     // console.log(`\n\n${JSON.stringify(questionRedactionRequest)}\n\n`);
        //     let questionRedactionResponse = await Question.create(questionRedactionRequest).catch(error => {throw error});
        //     for(critere of questionRedactionRequest.criteres) {
        //         const newCritere = {...critere,...{questionId:questionRedactionResponse.id}};
        //         await CriteriaPointQuestion.create(newCritere).catch(error => {throw error});
        //     } 
        //     for(index=0;index<questionRedactionRequest.responses.choices.length;index++){    
        //         await Reponse.create({choices:questionRedactionRequest.responses.choices[index],isAnswers:questionRedactionRequest.responses.isAnswers[index], questionId:questionRedactionResponse.id}).catch(error => {throw error});
        //     }
        // }
        // console.log(req.body.listAudio);
        // const listAudio = req.body.listAudio || null;
        // for(const questionAudioRequest of listAudio){
        //     // console.log(`\n\n${JSON.stringify(questionRedactionRequest)}\n\n`);
        //     let questionAudioResponse = await Question.create(questionAudioRequest).catch(error => {throw error});
        //     for((critere) of questionAudioRequest.criteres){
        //         const newCritere = {...critere,...{questionId:questionAudioResponse.id}};
        //         await CriteriaPointQuestion.create(newCritere).catch(error => {throw error});
        //     };
        //     await Reponse.create({type_audio:questionAudioRequest.responses.type_audio, questionId:questionAudioResponse.id}).catch(error => {throw error});
        // }
        // const listVideo = req.body.listVideo || null;
        // for(const questionVideoRequest of listVideo){
        //     console.log(`\n\n${JSON.stringify(questionVideoRequest)}\n\n`);
        //     let questionVideoResponse = await Question.create(questionVideoRequest).catch(error => {throw error});
        //     console.log(JSON.stringify(questionVideoResponse));
        //     for((critere) of questionVideoRequest.criteres){
        //         const newCritere = {...critere,...{questionId:questionVideoResponse.id}};
        //         await CriteriaPointQuestion.create(newCritere).catch(error => {throw error});
        //     };
        //     await Reponse.create({type_audio:questionVideoRequest.responses.type_audio, questionId:questionVideoResponse.id}).catch(error => {throw error});
        // }
    } catch (error) {
        res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .send({
                message:
                    error.message || "Some error occurred while retrieving tutorials.",
                error: true
            });
    }
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
exports.findAllQuiz = (req,res) => {
  try {
    Quiz.findAll({include: [{model: db.offre}]})
    .then(data => {
      res
        .status(HttpStatus.OK)
        .send({data:data, error: false});
    })
    .catch(error => {
      throw error;
    })
  } catch (error) {
      console.log(">> Error while finding comment: ", error);
            res
                .status(HttpStatus.NOT_FOUND)
                .send({ message: error.message, error: true });
  }
}
exports.findOneQuizById = (req, res) => {
    try {
        Quiz.findOne({
            where:{id: req.params.userId},
            include:
            [{
                model: Offre,
                include:
                [{
                    model: Question,as: "questions",
                    include:
                    [{model:CriteriaPointQuestion},{model:Reponse ,as: "options"}]
                }]
            }]
        })
        .then(quiz => {
            res
                .status(HttpStatus.OK)
                .send({data:quiz, error: false});
        })
    } catch (error) {
        console.log(">> Error while finding project: ", error);
        res
            .status(HttpStatus.NOT_FOUND)
            .send({ message: error.message, error: true });
    }
}