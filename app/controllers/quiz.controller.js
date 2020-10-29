const db = require("../models");
const Quiz = db.quiz;
const Offre = db.offre;
const Dossier = db.dossier;
const CriteriaPointQuestion = db.criteria_point_question;
const Question = db.question;
const Reponse = db.reponse;
const QuizToOffer = db.quiz_to_offer;
const DossierOffer = db.dossier_offer;
const Op = db.Sequelize.Op;
const fs = require('fs');
const HttpStatus = require('http-status-codes');
const { response } = require("express");
const options = require("dotenv/lib/env-options");
const { quiz, question, offre, dossier } = require("../models");
const ResponseTest = db.response_test;
exports.create = async (req, res) => {
    // offres id
    const transaction_quiz = await db.sequelize.transaction();
    try{
        const quiz = await Quiz.create({name:req.body.name,fiche_dir:req.body.fiche_dir,author_dir:req.body.author_dir,offreId:req.body.offer,userId:req.body.idUser,publier:req.body.publier, date_publication:(req.body.publier ? new Date() : null)},{transaction:transaction_quiz});
        if (req.body.offer) {
            await QuizToOffer.create({offreId:req.body.offer,quizzId:quiz.id},{transaction:transaction_quiz});
            // creation dossier
            const newDossier = await Dossier.create({titre:req.body.name,fiche:req.body.fiche_dir,auteur:req.body.author_dir,userId:req.body.userId},{transaction:transaction_quiz}).catch(error => {throw error});
            // console.log(await newDossier);
            await DossierOffer.create({offreId:req.body.offer,dossierId:newDossier.id},{transaction:transaction_quiz}).catch(error => {throw error});
        }
        const listTrueOrFalseRequest = req.body.listTrueOrFalse || null;
        for(const questionTrueFalseRequest of listTrueOrFalseRequest) {
            let questionTrueFalseResponse = await Question.create({...questionTrueFalseRequest,...{quizId:quiz.id}},{transaction:transaction_quiz}).catch(error => {throw error});
            for( const critere of questionTrueFalseRequest.criteres) {
                const newCritere = {...critere,...{questionId:questionTrueFalseResponse.id}};
                await CriteriaPointQuestion.create(newCritere,{transaction:transaction_quiz}).catch(error => {throw error});
            };
            // console.log(`\n\n${JSON.stringify(questionTrueFalseRequest.responses)}\n\n`);
            await Reponse.create({isAnswers:questionTrueFalseRequest.responses.isAnswers[0], questionId:questionTrueFalseResponse.id},{transaction:transaction_quiz}).catch(error => {throw error});
        };
        const listMultipleRequest = req.body.listMultiple || null;
        for(const questionMultipleRequest of listMultipleRequest) 
        {
            let questionMultipleResponse = await Question.create({...questionMultipleRequest,...{quizId:await quiz.id}},{transaction:transaction_quiz}).catch(error => {throw error});
            for( const critere of questionMultipleRequest.criteres) 
            {
                const newCritere = {...critere,...{questionId:questionMultipleResponse.id}};
                await CriteriaPointQuestion.create(newCritere,{transaction:transaction_quiz}).catch(error => {throw error});
                    for(index=0;index<questionMultipleRequest.responses.choices.length;index++)
                    {
                        await Reponse.create({choices:questionMultipleRequest.responses.choices[index],isAnswers:questionMultipleRequest.responses.isAnswers[index], questionId:questionMultipleResponse.id},{transaction:transaction_quiz}).catch(error => {throw error});
                    }
            }
        }
        const listClassementRequest = req.body.listClassement || null;
        for(const questionClassementRequest of listClassementRequest) {
            // console.log(`\n\n${JSON.stringify(questionClassementRequest)}\n\n`);
            let questionClassementResponse = await Question.create({...questionClassementRequest,...{quizId: await quiz.id}},{transaction:transaction_quiz}).catch(error => {throw error});
            for(const critere of questionClassementRequest.criteres) {
                const newCritere = {...critere,...{questionId:questionClassementResponse.id}};
                await CriteriaPointQuestion.create(newCritere,{transaction:transaction_quiz}).catch(error => {throw error});
                for(index=0;index<questionClassementRequest.responses.choices.length; index++) {                                        
                    // await Reponse.create({choices:questionClassementRequest.responses.choices[index],rang:questionClassementRequest.responses.rang[index], questionId:questionClassementResponse.id},{transaction_quiz}).catch(error => {throw error});
                    await Reponse.create({choices:questionClassementRequest.responses.choices[index], rang:index+1, questionId:questionClassementResponse.id},{transaction:transaction_quiz}).catch(error => {throw error});
                }
            }
        };
        const listRedactionRequest = req.body.listRedaction || null;
        for(const questionRedactionRequest of listRedactionRequest) {
            // console.log(`\n\n${JSON.stringify(questionRedactionRequest)}\n\n`);
            let questionRedactionResponse = await Question.create({...questionRedactionRequest,...{quizId:await quiz.id}},{transaction:transaction_quiz}).catch(error => {throw error});
            for(critere of questionRedactionRequest.criteres) {
                const newCritere = {...critere,...{questionId:questionRedactionResponse.id}};
                await CriteriaPointQuestion.create(newCritere,{transaction:transaction_quiz}).catch(error => {throw error});
            } 
            for(index=0;index<questionRedactionRequest.responses.choices.length;index++){    
                await Reponse.create({choices:questionRedactionRequest.responses.choices[index],isAnswers:questionRedactionRequest.responses.isAnswers[index], questionId:questionRedactionResponse.id},{transaction:transaction_quiz}).catch(error => {throw error});
            }
        }
        console.log(req.body.listAudio);
        const listAudio = req.body.listAudio || null;
        for(const questionAudioRequest of listAudio){
            // console.log(`\n\n${JSON.stringify(questionRedactionRequest)}\n\n`);
            let questionAudioResponse = await Question.create({...questionAudioRequest,...{quizId: await quiz.id}},{transaction:transaction_quiz}).catch(error => {throw error});
            for((critere) of questionAudioRequest.criteres){
                const newCritere = {...critere,...{questionId:questionAudioResponse.id}};
                await CriteriaPointQuestion.create(newCritere,{transaction:transaction_quiz}).catch(error => {throw error});
            };
            await Reponse.create({type_audio:questionAudioRequest.responses.type_audio, questionId:questionAudioResponse.id},{transaction:transaction_quiz}).catch(error => {throw error});
        }
        const listVideo = req.body.listVideo || null;
        for(const questionVideoRequest of listVideo){
            console.log(`\n\n${JSON.stringify(questionVideoRequest)}\n\n`);
            let questionVideoResponse = await Question.create({...questionVideoRequest,...{quizId:await quiz.id}},{transaction:transaction_quiz}).catch(error => {throw error});
            console.log(JSON.stringify(questionVideoResponse));
            for((critere) of questionVideoRequest.criteres){
                const newCritere = {...critere,...{questionId:questionVideoResponse.id}};
                await CriteriaPointQuestion.create(newCritere,{transaction:transaction_quiz}).catch(error => {throw error});
            };
            await Reponse.create({type_audio:questionVideoRequest.responses.type_audio, questionId:questionVideoResponse.id},{transaction:transaction_quiz}).catch(error => {throw error});
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
    const current_quiz = await QuizToOffer.findOne({
        where: {offreId:req.params.id},
        include:[
            {
                model: db.offre,
            },
            {
                model: db.quiz,
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
        // update quiztooffer
        if (req.body.offer) {
            QuizToOffer.findOne({where:{quizId:req.params.quizId}})
            .then(quizToOffer => {
                if(quizToOffer){
                    console.log(quizToOffer);
                    QuizToOffer.update({offreId:req.body.offer},{where:{quizzId:req.params.quizId}});
                }
                else{
                    QuizToOffer.create({offreId:req.body.offer,quizzId:req.params.quizId});
                }
            });

        }
        else{
            QuizToOffer.destroy({where:{quizzId:req.params.quizId}});
        }
        // True or False
        const listTrueOrFalseRequest = req.body.listTrueOrFalse || null;
        const listIds = req.body.listIds;
        let questionTrueFalseResponse;
        for(const questionTrueFalseRequest of listTrueOrFalseRequest) {
            if (questionTrueFalseRequest.id && questionTrueFalseRequest.id !== null && questionTrueFalseRequest.id !== '') {                
                questionTrueFalseResponse = await Question.update(questionTrueFalseRequest,
                    {where:{id: questionTrueFalseRequest.id}
                })
                .then(() => {
                    // remove this id in the listIds.questions
                    const index = listIds.questions.indexOf(questionTrueFalseRequest.id);
                    if (index > -1) {
                        listIds.questions.splice(index,1);
                    }
                    return {id: questionTrueFalseRequest.id}
                })
                .catch(error => {throw error});
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
                    })
                    .then(() => {
                        // remove this id in the listIds.criteres
                        const index = listIds.criteres.indexOf(newCritere.id);
                        if (index > -1) {
                            listIds.criteres.splice(index,1);
                        }
                    })
                    .catch(error => {throw error});
                }
                else{
                    await CriteriaPointQuestion.create(newCritere).catch(error => {throw error});
                }
            };
            // console.log(`\n\n${JSON.stringify(questionTrueFalseRequest.responses)}\n\n`);
            if (questionTrueFalseRequest.responses.id[0] && questionTrueFalseRequest.responses.id[0] !== null && questionTrueFalseRequest.responses.id[0] !== '' ) {
                await Reponse.update({isAnswers:questionTrueFalseRequest.responses.isAnswers[0], questionId:questionTrueFalseResponse.id},
                    {where: {id:questionTrueFalseRequest.responses.id[0]}})
                    .then(()=>{
                        // remove this id in the listIds.responses
                        const index = listIds.responses.indexOf(questionTrueFalseRequest.responses.id[0]);
                        if (index > -1) {
                            listIds.responses.splice(index,1);
                        }
                    })
                    .catch(error => {throw error});
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
                })
                .then(() => {
                    // remove this id in the listIds.questions
                    const index = listIds.questions.indexOf(questionMultipleRequest.id);
                    if (index > -1) {
                        listIds.questions.splice(index,1);
                    }
                    return {id: questionMultipleRequest.id} 
                })
                .catch(error => {throw error});
            } else {
                questionMultipleResponse = await Question.create(questionMultipleRequest)
                .catch(error => {throw error});
            }
            const newCritere = questionMultipleRequest.criteres[0];
            if (newCritere.id && newCritere.id !== null && newCritere.id !== '') {
                await CriteriaPointQuestion.update(newCritere,
                    {where:{id: newCritere.id }
                })
                .then(() => {
                    // remove this id in the listIds.criteres
                    const index = listIds.criteres.indexOf(newCritere.id);
                    if (index > -1) {
                        listIds.criteres.splice(index,1);
                    }
                })
                .catch(error => {throw error});
            } else {
                await CriteriaPointQuestion.create(newCritere).catch(error => {throw error});
            }
                for(index=0;index<questionMultipleRequest.responses.choices.length;index++)
                {
                    if (questionMultipleRequest.responses.id[index] && questionMultipleRequest.responses.id[index]!==null && questionMultipleRequest.responses.id[index]!=='' ) {
                        await Reponse.update({choices:questionMultipleRequest.responses.choices[index],isAnswers:questionMultipleRequest.responses.isAnswers[index], questionId:questionMultipleResponse.id},{where:{id:questionMultipleRequest.responses.id[index]}})
                        .then(()=>{
                            // remove this id in the listIds.responses
                            const indexToDelete = listIds.responses.indexOf(questionMultipleRequest.responses.id[index]);
                            if (indexToDelete > -1) {
                                listIds.responses.splice(indexToDelete,1);
                            }
                        })
                        .catch(error => {throw error});
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
                .then(()=>{
                    // remove this id in the listIds.questions
                    const index = listIds.questions.indexOf(questionClassementRequest.id);
                    if (index > -1) {
                        listIds.questions.splice(index,1);
                    }
                    return {id: questionClassementRequest.id}
                })
                .catch(error => {throw error});
            } else {
                questionClassementResponse = await Question.create(questionClassementRequest)
                .catch(error => {throw error});
            }
            const newCritere = questionClassementRequest.criteres[0];
            if (newCritere.id && newCritere.id !== null && newCritere.id !== '') {
                await CriteriaPointQuestion.update(newCritere,
                    {where:{id: newCritere.id }
                })
                .then(()=>{
                    // remove this id in the listIds.criteres
                    const index = listIds.criteres.indexOf(newCritere.id);
                    if (index > -1) {
                        listIds.criteres.splice(index,1);
                    }
                })
                .catch(error => {throw error});
            } else {
                await CriteriaPointQuestion.create(newCritere).catch(error => {throw error});
            }
                for(index=0;index<questionClassementRequest.responses.choices.length; index++) {                                        
                    if (questionClassementRequest.responses.id[index] && questionClassementRequest.responses.id[index]!==null && questionClassementRequest.responses.id[index]!=='' ) {
                        await Reponse.update({choices:questionClassementRequest.responses.choices[index], rang:index, questionId:questionClassementResponse.id},{where:{id:questionClassementRequest.responses.id[index]}})
                        .then(()=>{
                            // remove this id in the listIds.responses
                            const indexToDelete = listIds.responses.indexOf(questionClassementRequest.responses.id[index]);
                            if (indexToDelete > -1) {
                                listIds.responses.splice(indexToDelete,1);
                            } 
                        })
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
                questionRedactionResponse = await Question.update(questionRedactionRequest,{where:{id:questionRedactionRequest.id}})
                .then(()=>{
                    // remove this id in the listIds.questions
                    const index = listIds.questions.indexOf(questionRedactionRequest.id);
                    if (index > -1) {
                        listIds.questions.splice(index,1);
                    }
                    return {id: questionRedactionRequest.id}
                })
                .catch(error => {throw error});
            } else {
                questionRedactionResponse = await Question.create(questionRedactionRequest).catch(error => {throw error});
            }
            for(critere of questionRedactionRequest.criteres) {
                if (critere.id && critere.id !== null && critere.id !== '') {
                    await CriteriaPointQuestion.update(critere,{where:{id:critere.id}})
                    .then(()=>{
                        // remove this id in the listIds.criteres
                        const index = listIds.criteres.indexOf(critere.id);
                        if (index > -1) {
                            listIds.criteres.splice(index,1);
                        }                
                    })
                    .catch(error => {throw error});
                } else {
                    await CriteriaPointQuestion.create(critere).catch(error => {throw error});
                }
            }
            for(index=0;index<questionRedactionRequest.responses.choices.length;index++){
                if (questionRedactionRequest.responses.id[index] && questionRedactionRequest.responses.id[index] !== null && questionRedactionRequest.responses.id[index] !== '') {
                    await Reponse.update({choices:questionRedactionRequest.responses.choices[index],isAnswers:questionRedactionRequest.responses.isAnswers[index], questionId:questionRedactionResponse.id},{where:{id:questionRedactionRequest.responses.id[index]}})
                    .then(()=>{
                        // remove this id in the listIds.responses
                        const indexToDelete = listIds.responses.indexOf(questionRedactionRequest.responses.id[index]);
                        if (indexToDelete > -1) {
                            listIds.responses.splice(indexToDelete,1);
                        }
                    })
                    .catch(error => {throw error});
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
                questionAudioResponse = await Question.update(questionAudioRequest, {where:{id: questionAudioRequest.id}})
                .then(()=>{
                    // remove this id in the listIds.questions
                    const index = listIds.questions.indexOf(questionAudioRequest.id);
                    if (index > -1) {
                        listIds.questions.splice(index,1);
                    }
                    return {id: questionAudioRequest.id}
                })
                .catch(error => {throw error});
            } else {
                questionAudioResponse = await Question.create(questionAudioRequest).catch(error => {throw error});
            }
            for(critere of questionAudioRequest.criteres) {
                if (critere.id && critere.id !== null && critere.id !== '') {
                    await CriteriaPointQuestion.update(critere,{where:{id:critere.id}})
                    .then(() => {
                        // remove this id in the listIds.criteres
                        const index = listIds.criteres.indexOf(critere.id);
                        if (index > -1) {
                            listIds.criteres.splice(index,1);
                        }
                    })
                    .catch(error => {throw error});
                } else {
                    await CriteriaPointQuestion.create(critere).catch(error => {throw error});
                }
            }
            for(index=0;index<questionAudioRequest.responses.id.length;index++){
                if (questionAudioRequest.responses.id[index] && questionAudioRequest.responses.id[index] !== null && questionAudioRequest.responses.id[index] !== '') {
                    await Reponse.update({type_audio:questionAudioRequest.responses.type_audio, questionId:questionAudioResponse.id},{where:{id:questionAudioRequest.responses.id[index]}})
                    .then(()=>{
                        // remove this id in the listIds.responses
                        const indexToDelete = listIds.responses.indexOf(questionAudioRequest.responses.id[index]);
                        if (indexToDelete > -1) {
                            listIds.responses.splice(indexToDelete,1);
                        }
                    })
                    .catch(error => {throw error});
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
                questionVideoResponse = await Question.update(questionVideoRequest, {where:{id: questionVideoRequest.id}})
                .then(()=>{
                    // remove this id in the listIds.questions
                    const index = listIds.questions.indexOf(questionVideoRequest.id);
                    if (index > -1) {
                        listIds.questions.splice(index,1);
                    }
                    return {id: questionVideoRequest.id}
                })
                .catch(error => {throw error});
            } else {
                questionVideoResponse = await Question.create(questionVideoRequest).catch(error => {throw error});
            }
            for(critere of questionVideoRequest.criteres) {
                if (critere.id && critere.id !== null && critere.id !== '') {
                    await CriteriaPointQuestion.update(critere,{where:{id:critere.id}})
                    .then(() => {
                        // remove this id in the listIds.criteres
                        const index = listIds.criteres.indexOf(critere.id);
                        if (index > -1) {
                            listIds.criteres.splice(index,1);
                        }
                    })
                    .catch(error => {throw error});
                } else {
                    await CriteriaPointQuestion.create(critere).catch(error => {throw error});
                }
            }
            for(index=0;index<questionVideoRequest.responses.id.length;index++){
                if (questionVideoRequest.responses.id[index] && questionVideoRequest.responses.id[index] !== null && questionVideoRequest.responses.id[index] !== '') {
                    await Reponse.update({type_audio:questionVideoRequest.responses.type_audio, questionId:questionVideoResponse.id},{where:{id:questionVideoRequest.responses.id[index]}})
                    .then(()=>{
                       // remove this id in the listIds.responses
                       const indexToDelete = listIds.responses.indexOf(questionVideoRequest.responses.id[index]);
                       if (indexToDelete > -1) {
                           listIds.responses.splice(indexToDelete,1);
                       } 
                    })
                    .catch(error => {throw error});
                } else {
                    await Reponse.create({type_audio:questionVideoRequest.responses.type_audio, questionId:questionVideoResponse.id}).catch(error => {throw error});
                }
            }
        }
        for (let indexQuestionToDelete = 0; indexQuestionToDelete < listIds.questions.length; indexQuestionToDelete++) {
            Question.findOne({where:{id:listIds.questions[indexQuestionToDelete]}})
            .then((question) =>{
                if(question.id){
                    Question.destroy({where:{id:question.id}}).catch(error => {throw error});
                }
            })
            .catch(error => {
                throw error;
            })
        }
        for (let indexCritereToDelete = 0; indexCritereToDelete < listIds.criteres.length; indexCritereToDelete++) {
            CriteriaPointQuestion.findOne({where:{id:listIds.criteres[indexCritereToDelete]}})
            .then((critere) =>{
                if(critere.id){
                    CriteriaPointQuestion.destroy({where:{id:critere.id}}).catch(error => {throw error});
                }
            })
            .catch(error => {
                throw error;
            })
        }
        for (let indexResponseToDelete = 0; indexResponseToDelete < listIds.responses.length; indexResponseToDelete++) {
            db.reponse.findOne({where:{id:listIds.responses[indexResponseToDelete]}})
            .then((response) =>{
                if(response.id){
                    db.reponse.destroy({where:{id:response.id}}).catch(error => {throw error});
                }
            })
            .catch(error => {
                throw error;
            })
        }
        console.log(`\n\n\n${JSON.stringify(listIds)}\n\n\n`);
        res
            .status(HttpStatus.OK)
            .send({message: "success",error:false});
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

    db.quiz_to_offer.findAll({include: [
        {
            model:db.quiz,
            where:{userId: req.params.userId}
        },
        {
            model:db.offre
        }
    ]})

    // Quiz.findAll({where:{userId: req.params.userId}},
    //     {
    //         include: [
    //             {
    //                 model: db.quiz_to_offer,
                    
    //             }
    //         ]
    //     })
    .then(data => {
        console.log(data);
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
            where:{id: req.params.quizId},
            include:
            [
            {model: db.offre,as:"offerInQuiz"},
            {model: Question,as: "questions",
                include:
                [{model:CriteriaPointQuestion},{model:Reponse ,as: "options"}]
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

exports.updateQuizStatePublished = (req, res) => {
    try {
        Quiz.update({publier:req.body.publier,date_publication:(req.body.publier ? new Date() : null)},{where:{id:req.params.id}})
        .then(row => {
            res
                .status(HttpStatus.OK)
                .send({message:"quiz is updated successfully",error:false});
        })
        .catch(error => {
            throw error;
        });
    } catch (error) {
        console.log(">> Error while finding project: ", error);
        res
            .status(HttpStatus.NOT_FOUND)
            .send({ message: error.message, error: true });
    }
}

exports.getResponseTestByPostulation = async (req,res) => {
    try {
        await ResponseTest.findAll({
            where:{[Op.and]:[{offreId:req.params.offreId},{userId:req.params.userId}]},
            include:[
                {
                    model:db.question,
                    // where:{TypeQuestionId:{[Op.gt]: 3}},
                    include:[
                        {
                            model:db.criteria_point_question,
                            include:[{model:db.details_note}]
                        },
                        {model:db.quiz},
                        {model:db.type_question,attributes:["id","wording"]}
                    ],
                },
                {
                    model:db.user,
                    attributes:["id"],
                    include:[
                        {
                            model:db.profile,
                            attributes:["firstName","lastName"]
                        }
                    ]
                },
                {
                    model:db.details_note,
                    include:[{model:db.criteria_point_question}]
                },
            ]
        })
        .then(response => {
          res
                .status(HttpStatus.OK)
                .send({data:response, error: false});         
        })
        .catch(error => {
            throw error;
        })
    } catch (error) {
      console.log(">> Error while finding project: ", error);
      res
          .status(HttpStatus.NOT_FOUND)
          .send({ message: error.message, error: true });
    }
}

exports.createResponseQuizz = async (req,res) => {
    const transaction_response_quiz = await db.sequelize.transaction();
  try {
      let responses = JSON.parse(req.body.listResponseTest);
      console.log(req.body.listResponseTest);
      for (let index = 0; index < responses.length; index++) {
          if (req.files.fileAudio) {              
              for (let indexFiles = 0; indexFiles < req.files.fileAudio.length; indexFiles++) {
                  if (req.files.fileAudio && responses[index].answers === req.files.fileAudio[indexFiles].originalname) {
                      let pathname = req.files.fileAudio[indexFiles].path.split("/");
                      responses[index].answers = pathname.splice(1,2).join("/");
                  }
                  if (req.files.fileVideo && responses[index].answers === req.files.fileVideo[indexFiles].originalname) {
                      let pathname = req.files.fileVideo[indexFiles].path.split("/");
                      responses[index].answers = pathname.splice(1,2).join("/");
                  }
              }
          }
        const responseTest = await ResponseTest.create(responses[index],{transaction:transaction_response_quiz})
        .then(responseTest =>{ return responseTest})
        .catch(error => {throw error});

        const criteres = await Question.findOne({where:{id:responseTest.questionId}, include:[{model:CriteriaPointQuestion}]})
        .then(question => {
            return question.criteria_point_questions;
        })
        .catch(error => { throw error});
        for (let index = 0; index < criteres.length; index++) {
            console.log(`(${await criteres[index].id},${await responseTest.id})`);
            await db.details_note.create({critereId:await criteres[index].id, responseTestId:await responseTest.id},{transaction:transaction_response_quiz})
            .catch(error => { throw error });
        }
    }
    await transaction_response_quiz.commit();
        res
            .status(HttpStatus.CREATED)
            .send({
                message: "responses are successfull saved",
                error: false
            })
  } catch (error) {
    await transaction_response_quiz.rollback();
    console.log(">> Error while finding project: ", error);
      res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ message: error.message, error: true });
  }
}

exports.updateResponseQuizz = async(req,res) => {
    try {
      await ResponseTest.update({pointWin:req.body.pointWin},{where:{[Op.and]:[{offreId:req.params.offreId},{userId:req.params.userId},{id:req.body.id}]}})
      .then(() => {
        res
            .status(HttpStatus.OK)
            .send({
                message: "reponses of quizz updated successfully",
                error: false
            })
      })
      .catch(error => {
        throw error;
      })
    } catch (error) {
        console.log(">> Error while finding project: ", error);
        res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .send({ message: error.message, error: true });
    }
}

exports.uploadMediaAudio = (req, res) => {
  try {
    console.log(req.files);    
  } catch (error) {
    console.log(">> Error while finding project: ", error);
        res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .send({ message: error.message, error: true });
  }
}

exports.updateResponsePostulationMultiple = async (req, res) => {
    const transaction_update_response_quiz = await db.sequelize.transaction();
    let resultNote = 0;
    try {
    //   console.log(req.body.responseToUpdate);  
      const responseToUpdate = req.body.responseToUpdate;
      for (let indexResponse = 0; indexResponse < responseToUpdate.length; indexResponse++) {
        for (let indexDetailsNote = 0; indexDetailsNote < responseToUpdate[indexResponse].details_notes.length; indexDetailsNote++) {
           await db.details_note.update(responseToUpdate[indexResponse].details_notes[indexDetailsNote],{where:{id:responseToUpdate[indexResponse].details_notes[indexDetailsNote].id}},{transaction:transaction_update_response_quiz}).catch(error => {throw error;});
           resultNote += parseInt(responseToUpdate[indexResponse].details_notes[indexDetailsNote].note);
        }
      }
      const postulation_note = await db.postulation.findOne({where:{[Op.and]:[{offreId:responseToUpdate[0].offreId},{userId:responseToUpdate[0].userId}]}})
      .then(postulation => {return postulation.note})
      .catch(error => {throw error});
      console.log(postulation_note);
      resultNote+=parseInt(postulation_note);
      await db.postulation.update({note:resultNote, offreId:responseToUpdate[0].offreId,userId:responseToUpdate[0].userId,noted_main: true},{where:{[Op.and]:[{offreId:responseToUpdate[0].offreId},{userId:responseToUpdate[0].userId}]}}, {transaction: transaction_update_response_quiz}).catch(error => {throw error});
    //   for (let index = 0; index < responseToUpdate.length; index++) {
    //     await ResponseTest.update({pointWin:responseToUpdate[index].pointWin},{where:{id:responseToUpdate[index].id}})
    //     .catch(error => {
    //         throw error;
    //     });
    //   }
    console.log(`\nNOTE:${resultNote}\n`);
      await transaction_update_response_quiz.commit();
        res
            .status(HttpStatus.CREATED)
            .send({
                message: "responses are successfull updated",
                error: false
            })
    } catch (error) {
        await transaction_update_response_quiz.rollback();
        console.log(">> Error while finding project: ", error);
        res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .send({ message: error.message, error: true });
    }
}

exports.destroyOffre = async (req,res) => {
  try {
    db.offre.destroy({where:{id:req.params.id}})
    .then(()=> {
      res
      .status(HttpStatus.NO_CONTENT)
      .send({
          message: "Offre is deleted successfully",
          error: false
      })
    })
    .catch(error => {throw error});
    
  } catch (error) {
    console.log(">> Error while finding project: ", error);
        res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .send({ message: error.message, error: true });
  }
}