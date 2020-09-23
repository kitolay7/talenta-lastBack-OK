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
	
    //console.log('bodddddddyyyyy' + req.files)
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
            JSON.parse(req.body.competence).forEach((competence) => {
                competences.push({
                    name: competence,
                })
            });
            return competences;
        }
        console.log(`\n\n Competences ${JSON.stringify(competences(req))}\n\n`);
        const educations = (req) => {
            let educations = [];
            JSON.parse(req.body.education).forEach((education) => {
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
            JSON.parse(req.body.profession).forEach((profession) => {
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
        const blobFile = (req.files.cv && req.files.cv[0]) ? {
            path: req.files.cv[0].originalname,
            extension: req.files.cv[0].originalname.split('.').pop(),
            TypeBlobId: 5 // cv
        } : null
        console.log(`\n\nblobFile ${JSON.stringify(blobFile)}\n\n`);

        return {
            competences,
            educations,
            professions,
            blobFile
        }
    }
    // CREATION 
    const { competences, educations, professions, blobFile } = generateData(req);

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
        blobFile && await db.blobscv.create({ ...blobFile, ...{ spontaneousId: current_spontaneous.id } }, { transaction: transaction_spontaneous });
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
            { model: db.profession },
            { model: db.blobscv }]
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
exports.findSpontaneousNonTraiter = (req, res) => {
    Spontaneous.findAll({
    	where: { traiter: false },
    	include:
            [{ model: db.competence },
            { model: db.education },
            { model: db.profession },
            { model: db.blobscv }]
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
            { model: db.profession },
            { model: db.blobscv }]
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
exports.updateSpontaneousTraiter = async (req, res) => {
  	console.log(req.body)
  	console.log(req.params)
  	if (!req.params || !req.body) {
    	return res.status(400).send({
      	message: "Data to update can not be empty!"
    	});
  	}
  	
  	const id = req.params.id;
  	try {
    	Spontaneous.update({
      			traiter: req.body.traiter,
    		}, {where: {id: id} })
        	.then(data => {
            	res
      				.send({
        				message: "Successfully update",
        				error: false
      				})
        	})
    } catch (err) {
    	res
      		.status(HttpStatus.INTERNAL_SERVER_ERROR)
      		.send({ message: err, error: true });
    	console.log(">> Error while finding comment: ", err);
  	}
};
