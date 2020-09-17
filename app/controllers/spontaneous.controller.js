const db = require("../models");
const HttpStatus = require('http-status-codes');
const io = require("socket.io-client");

const fs = require('fs');
const { error, count } = require("console");

const Spontaneous = db.spontaneous;
const Competence = db.competence;
const Education = db.education;
const Profession = db.profession;
const Op = db.Sequelize.Op;

exports.createSpontaneous = async (req, res) => {
	
    const spontaneous = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthday: req.body.birthday,
      email: req.body.email,
      numTel: req.body.numTel,
      idSkype: req.body.idSkype,
      idWhatsapp: req.body.idWhatsapp,
      originCountry: req.body.originCountry,
      actualCountry: req.body.actualCountry,
      actualCity: req.body.actualCity,
      secteur: req.body.secteur,
    };
    
    // Creation Data
    console.log(spontaneous)
    const generateData = (req) => {
        const competences = (req) => {
            let competences = [];
            req.body.competence.forEach((competence) => {
                competences.push({
                    name: competence,
                })
            });
            return competences;
        }
        console.log(`\n\n Competences ${JSON.stringify(competences(req))}\n\n`);
        const educations = (req) => {
            let educations = [];
            req.body.education.forEach((education) => {
                educations.push({
                    titre: education.titre,
                    specialisation: education.specialisation,
                    diplome: education.diplome,
                    startDate: education.startDate,
                    endDate: education.endDate,
                })
            });
            return educations;
        }
        console.log(`\n\n Educations ${JSON.stringify(educations(req))}\n\n`);
        const professions = (req) => {
            let professions = [];
            req.body.profession.forEach((profession) => {
                professions.push({
                    titre: profession.titre,
                    nomSociete: profession.nomSociete,
                    resume: profession.resume,
                    startDate: profession.startDate,
                    endDate: profession.endDate,
                })
            });
            return professions;
        }
        console.log(`\n\n Professions ${JSON.stringify(professions(req))}\n\n`);

        return {
            competences,
            educations,
            professions
        }
    }
    // CREATION 
    const { competences, educations, professions } = generateData(req);

    const transaction_spontaneous = await db.sequelize.transaction();
    const bulkMerge = (objectList, object) => {
        let result = [];
        objectList.forEach((item) => {
            result.push({ ...item, ...object });
        });
        return result;
    }

    try {
        // SPONTANEOUS CREATION
        const current_spontaneous = await Spontaneous.create(spontaneous, { transaction: transaction_spontaneous });
        await Competence.bulkCreate(bulkMerge(competences(req), { spontaneousId: current_spontaneous.id }), { returning: true, transaction: transaction_spontaneous })
        await Education.bulkCreate(bulkMerge(educations(req), { spontaneousId: current_spontaneous.id }), { returning: true, transaction: transaction_spontaneous })
        await Profession.bulkCreate(bulkMerge(professions(req), { spontaneousId: current_spontaneous.id }), { returning: true, transaction: transaction_spontaneous })
        await transaction_spontaneous.commit();
        res
            .send({
                message: "successfully created",
                data: {...current_spontaneous.dataValues},
                error: false
            })
    } catch (error) {
    	console.log(error);
        await transaction_spontaneous.rollback();
        res
            .send({ message: error, error: true });
    }
};

exports.findAllSpontaneous = (req, res) => {
    Spontaneous.findAll({
        include:
            [{ model: db.competence },
            { model: db.education },
            { model: db.profession }]
    })
        .then(data => {
            res
                .send(data);
        })
        .catch(err => {
            res
                .send({
                    message:
                        err.message || "Some error occurred while retrieving tutorials.",
                    error: true
                });
        });
};
exports.findOneSpontaneous = (req, res) => {
    Spontaneous.findOne({
    	where: { id: req.params.spontaneousId },
        include:
            [{ model: db.competence },
            { model: db.education },
            { model: db.profession }]
    })
        .then(data => {
            res
                .send(data);
        })
        .catch(err => {
            res
                .send({
                    message:
                        err.message || "Some error occurred while retrieving tutorials.",
                    error: true
                });
        });
};
