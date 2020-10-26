const db = require("../models");
const HttpStatus = require('http-status-codes');
const io = require("socket.io-client");
const legit = require('legit');

const fs = require('fs');
const { error, count } = require("console");
const { sendMail } = require("../middleware");

const Spontaneous = db.spontaneous;
const Competence = db.competence;
const Education = db.education;
const Profession = db.profession;
const Op = db.Sequelize.Op;
require('dotenv/config');

exports.createSpontaneous = async (req, res) => {

    //console.log('bodddddddyyyyy' + JSON.stringify(req.files))
    
    try {
    
  		await legit(req.body.email)
  		.then(result => {
    		result.isValid ? console.log('Valid!') : console.log('Invalid!');
    		//console.log(JSON.stringify(result));
    		if (!result.isValid) { // if email doesn't exist : resp = false
        		throw "L'adresse email n'existe pas";
      		}
  		})
  		.catch((err) => { throw err });
    	
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
    	//console.log(spontaneous)
	
	
    	const mail = {
        	body: {
            	email_recipient: req.body.email,
            	email_subject: `Dossier de Candidature spontanée déposé - Talenta Sourcing`,
            	email_content: `Bonjour! :) 
        		<br>
        		<br> 
        		Talenta a bien enregistré votre candidature spontanée et prend en charge son orientation suivant les informations communiquées. 
        		<br>
        		<br>  
        		L'équipe Talenta vous remercie de votre confiance. 
        		<br>
        		***************************************************************************************************`
        	}
    	}
	
    	const getCompetences = () => {
        	let allCompetences = '';
        	JSON.parse(req.body.competence).forEach((competence) => {
            	allCompetences += `${competence}, `
        	});
        	return allCompetences
    	}
    	const getEducations = () => {
        	let allEducations = '';
        	let titre = '';
        	let specialisation = '';
        	let diplome = '';
        	let debut = '';
        	let fin = '';
        	JSON.parse(req.body.education).forEach((education) => {
            	titre = education.titre;
            	specialisation = education.specialisation;
            	diplome = education.diplome;
            	debut = education.startDate;
            	fin = education.endDate;
            	allEducations += `<strong>Titre</strong> : ${titre},<br> 
        			<strong>Specialisation</strong> : ${specialisation},<br>
        			<strong>Diplome</strong> : ${diplome},<br>
        			<strong>Debut</strong> : ${debut},
        			<strong>Fin</strong> : ${fin};<br>
        			<br>`;
        	});
        	return allEducations
    	}
    	const getProfessions = () => {
        	let allProfessions = '';
        	let titre = '';
        	let nomSociete = '';
        	let resume = '';
        	let debut = '';
        	let fin = '';
        	JSON.parse(req.body.profession).forEach((profession) => {
            	titre = profession.titre;
            	nomSociete = profession.nomSociete;
            	resume = profession.resume;
            	debut = profession.startDate;
            	fin = profession.endDate;
            	allProfessions += `<strong>Titre</strong> : ${titre},<br> 
        			<strong>Nom de la société</strong> : ${nomSociete},<br>
        			<strong>Résumé</strong> : ${resume},<br>
        			<strong>Debut</strong> : ${debut},
        			<strong>Fin</strong> : ${fin};<br>
        			<br>`;
        	});
        	return allProfessions
    	}
	
	
	
    	// Creation Data
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
        	//console.log(`\n\n Competences ${JSON.stringify(competences(req))}\n\n`);
	
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
        	//console.log(`\n\n Educations ${JSON.stringify(educations(req))}\n\n`);
	
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
        	//console.log(`\n\n Professions ${JSON.stringify(professions(req))}\n\n`);
	
        	const blobFile = (req.files.cv && req.files.cv[0]) ? {
            	path: req.files.cv[0].originalname,
            	extension: req.files.cv[0].originalname.split('.').pop(),
            	TypeBlobId: 5 // cv
        	} : null
        	//console.log(`\n\nblobFile ${JSON.stringify(blobFile)}\n\n`);
	
        	const blobInfos = (req.files.infos && req.files.infos[0]) ? {
            	path: req.files.infos[0].originalname,
            	extension: req.files.infos[0].originalname.split('.').pop(),
            	TypeBlobId: 5 // cv
        	} : null
        	//console.log(`\n\nblobInfos ${JSON.stringify(blobInfos)}\n\n`);
	
        	return {
            	competences,
            	educations,
            	professions,
            	blobFile,
            	blobInfos
        	}
    	}
    	// CREATION 
    	const { competences, educations, professions, blobFile, blobInfos } = generateData(req);
	
    	const transaction_spontaneous = await db.sequelize.transaction();
    	const bulkMerge = (objectList, object) => {
        	let result = [];
        	objectList.forEach((item) => {
            	result.push({ ...item, ...object });
        	});
        	return result;
    	}

        // SPONTANEOUS CREATION
        const current_spontaneous = await Spontaneous.create(spontaneous, { transaction: transaction_spontaneous });
        await Competence.bulkCreate(bulkMerge(competences(req), { spontaneousId: current_spontaneous.id }), { returning: true, transaction: transaction_spontaneous })
        await Education.bulkCreate(bulkMerge(educations(req), { spontaneousId: current_spontaneous.id }), { returning: true, transaction: transaction_spontaneous })
        await Profession.bulkCreate(bulkMerge(professions(req), { spontaneousId: current_spontaneous.id }), { returning: true, transaction: transaction_spontaneous })
        blobFile && await db.blobscv.create({ ...blobFile, ...{ spontaneousId: current_spontaneous.id } }, { transaction: transaction_spontaneous });
        blobInfos && await db.blobscv.create({ ...blobInfos, ...{ spontaneousId: current_spontaneous.id } }, { transaction: transaction_spontaneous });
        await transaction_spontaneous.commit();


        // Send Mail to the Talenta responsible
        const url = [
            (req.files.cv && req.files.cv[0]) ?
                {
                    filename: `${req.files.cv[0].filename}`,
                    path: `http://${req.headers.host}/cv/${req.files.cv[0].filename}`,
                } : {},
            {
                filename: `${req.files.infos[0].filename}`,
                path: `http://${req.headers.host}/cv/${req.files.infos[0].filename}`,
            }
        ]
        const infos = {
            body: {
                //email_recipient: process.env.FROM_EMAIL,
                email_recipient: process.env.ADMIN_EMAIL,
                email_subject: `Nouveau dossier de candidature spontanée - Talenta Sourcing`,
                email_attachement: url,
                email_content: `Nouveau dossier de candidature spontanée! <br>
        			<br> <u>Nom </u>: ${spontaneous.firstName},
        			<br> <u>Prénoms </u>: ${spontaneous.lastName},
        			<br> <u>Email </u>: ${spontaneous.email},
        			<br> <u>Numero de téléphone </u>: ${spontaneous.numTel},
        			<br> <u>Id Skype </u>: ${spontaneous.idSkype},
        			<br> <u>Id Whatsapp </u>: ${spontaneous.idWhatsapp},
        			<br> <u>Voyage hors du pays d'origine </u>: ${spontaneous.originCountry === 'true' ? 'Oui' : 'Non'},
        			<br> <u>Pays actuel </u>: ${spontaneous.actualCountry},
        			<br> <u>Ville actuel </u>: ${spontaneous.actualCity},
        			<br> <u>Secteur </u>: ${spontaneous.secteur},
        			<br> <u>Compétences </u>: ${getCompetences()},
        			<br> <u>Educations </u>: <br> ${getEducations()},
        			<br> <u>Professions </u>: <br> ${getProfessions()},
                    ${(req.files.cv && req.files.cv[0]) ?
                        `<br> <u>CV importé </u>: <a href="http://`
                        + req.headers.host
                        + `/cv/`
                        + req.files.cv[0].filename
                        + `">`
                        + req.files.cv[0].originalname
                        + `</a>` : ``}
        			<br>
        			<br>
        			***************************************************************************************************`
            }
        }

        await sendMail(infos, res, {});
        
        
        // Send Mail to the Candidat
        await sendMail(mail, res, {});

        res
            .send({
                message: "successfully created",
                data: { ...current_spontaneous.dataValues },
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
        }, { where: { id: id } })
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
