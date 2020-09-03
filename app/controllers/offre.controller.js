const db = require("../models");
const HttpStatus = require('http-status-codes');
const io = require("socket.io-client");

const fs = require('fs');
const { error, count } = require("console");
const { postulation, user, profile } = require("../models");
const Quiz = db.quiz;
const offres = db.offre;
const User = db.user;
const Reponse = db.reponse;
const Postulation = db.postulation;
const Profile = db.profile;
const Op = db.Sequelize.Op;
exports.createOffre = async (req, res) => {
    const offre = {
        titre: req.body.titre,
        description: req.body.description,
        contexte: req.body.contexte,
        missions: req.body.missions,
        qualification: req.body.qualification,
        messages: req.body.messages,
        publier: req.body.publier,
        archived: req.body.archived,
        pays: req.body.pays,
        post: req.body.post,
        secteur: req.body.secteur,
        userId: req.body.userId,
        publicationDate: req.body.publicationDate 
        // logo: req.files.logo[0].filename,
        // video: req.files.video[0].filename,
    };
    // Creation Blob
    console.log(offre)
    const generateBlob = (req) => {
        const blobLogo = (req.files.logo && req.files.logo[0]) ? {
            path: req.files.logo[0].originalname,
            extension: req.files.logo[0].originalname.split('.').pop(),
            TypeBlobId: 1 // logo
        } : null
        console.log(`\n\nblobLogo ${JSON.stringify(blobLogo)}\n\n`);
        const blobVideo = (req.files.video && req.files.video[0]) ? {
            path: req.files.video[0].originalname,
            extension: req.files.video[0].originalname.split('.').pop(),
            TypeBlobId: 2 // video
        } : null
        console.log(`\n\nblobVideo ${JSON.stringify(blobVideo)}\n\n`);
        const blobPhotoAnimes = (req) => {
            let blobPhotoAnimes = [];
            req.files.photo_animes && req.files.photo_animes.forEach((photo_anime) => {
                blobPhotoAnimes.push({
                    path: photo_anime.originalname,
                    extension: photo_anime.originalname.split('.').pop(),
                    TypeBlobId: 3 // photo animés
                })
            });
            return blobPhotoAnimes;
        }
        console.log(`\n\n blobPhotoAnimes ${JSON.stringify(blobPhotoAnimes(req))}\n\n`);
        const blobPhotoDiaporamas = (req) => {
            let blobPhotoDiaporamas = [];
            req.files.diaporamas && req.files.diaporamas.forEach((photo_diapo) => {
                blobPhotoDiaporamas.push({
                    path: (new Date).valueOf() + photo_diapo.originalname,
                    extension: photo_diapo.originalname.split('.').pop(),
                    TypeBlobId: 4 // photo diapo
                })
            });
            return blobPhotoDiaporamas;
        }
        console.log(`\n\n blobPhotoDiaporamas ${JSON.stringify(blobPhotoDiaporamas(req))}\n\n`);

        // creation blobs for offre
        return {
            blobLogo,
            blobVideo,
            blobPhotoDiaporamas,
            blobPhotoAnimes
        }
    }
    // BLOBS CREATION 
    const { blobLogo, blobVideo, blobPhotoAnimes, blobPhotoDiaporamas } = generateBlob(req);

    const transaction_offer = await db.sequelize.transaction();
    const bulkMerge = (objectList, object) => {
        let result = [];
        objectList.forEach((item) => {
            result.push({ ...item, ...object });
        });
        return result;
    }

    try {
        // OFFRE CREATION
        const current_offer = await offres.create(offre, { transaction: transaction_offer });
        blobLogo && await db.blob.create({ ...blobLogo, ...{ OffreId: current_offer.id } }, { transaction: transaction_offer });
        blobVideo && await db.blob.create({ ...blobVideo, ...{ OffreId: current_offer.id } }, { transaction: transaction_offer });
        blobPhotoAnimes(req) && await db.blob.bulkCreate(bulkMerge(blobPhotoAnimes(req), { OffreId: current_offer.id }), { returning: true, transaction: transaction_offer })
        blobPhotoDiaporamas(req) && await db.blob.bulkCreate(bulkMerge(blobPhotoDiaporamas(req), { OffreId: current_offer.id }), { returning: true, transaction: transaction_offer });
        await transaction_offer.commit();
        res
            .send({
                message: "successfully created",
                data: {...current_offer.dataValues, ...{userId: req.body.userId}},
                error: false
            })
    } catch (error) {
        await transaction_offer.rollback();
        res
            .send({ message: error, error: true });
    }
    // console.log(req.body)
    // offres.create(offre).then((reponse) => {
    //     console.log(">> Created OFfre: " + JSON.stringify(reponse));
    //     res
    //         .status(HttpStatus.CREATED)
    //         .send({ message: reponse, error: false });
    //     return reponse;
    // })
    //     .catch((err) => {
    //         console.log(">> Error while creating comment: ", err);
    //         res
    //             .status(HttpStatus.INTERNAL_SERVER_ERROR)
    //             .send({ message: err, error: true });
    //     });

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

exports.getOfferByCreator = async (req, res) => {
  try {
    await offres.findAll({
        where: {
          userId: req.params.userId
        }
      },
    ).then(data => {
      res
        .status(HttpStatus.OK)
        .send({ data: data, error: false });
    }).catch(error => {
      throw error;
    })
  } catch (error) {
    res
                .status(HttpStatus.NOT_FOUND)
                .send({ message: err.message, error: true });
  }
}
exports.findAllPublished = (req, res) => {
    offres.findAll({
        include:
            [{
                model: db.blob,
                where: { publier: true },
                include: [{ model: db.type_blob }]
            }]
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
        });
};
exports.findAllOffer = (req, res) => {
    offres.findAll({
        include:
            [{
                model: db.blob,
                include: [{ model: db.type_blob }]
            }]
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
exports.findAllOfferbyIdUser = (req, res) => {
    offres.findAll({
        where:{ userId: req.params.idUSer},
        include:
        [{
            model: db.blob,
            include: [{ model: db.type_blob }],
           
        }]
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
exports.findOneOfferbyId = (req, res) => {
    offres.findAll({
        where:{ userId: req.params.idUSer},
        where:{ id: req.params.idOffer},
        include:
        [{
            model: db.blob,
            include: [{ model: db.type_blob }],
           
        }]
    })
        .then(data => {
            res
                .send({
                    data: data[0]
                });
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
exports.getOfferByPays = (req, res) => {
    offres.findAll({
        where:{ pays: req.params.pays, archived: false, publier: true},
        include:
        [{
            model: db.blob,
            include: [{ model: db.type_blob }],
           
        },{
            model:db.user, 
            through:db.postulation,
            as:'offer_postuled'
        }]})
        .then(data => {
            // console.log(data)
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
exports.getOfferArchived = (req, res) => {
    offres.scope('archived').findAll({
        include:
            [{
                model: db.blob,
                include: [{ model: db.type_blob }]
            }]
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
        });
}

exports.updateOfferStatusArchived = (req, res) => {
    offres.update(
        {
            archived: req.body.archived
        }, {
        where: { id: req.params.id },
        returning: true
    })
        .then((result) => {
            // console.log(`\n\n\n${result}\n\n\n`)
            if (result[1] === 0) throw "Any field is modified"
            res.status(HttpStatus.OK).json({
                message: "this offer is updated successfully",
                error: false
            })
        })
        .catch((error) => {
            // console.log(error);
            res
                .status(HttpStatus.NOT_ACCEPTABLE)
                .send({ message: error, error: true });
        });

}

exports.updateOfferStatusPublished = (req, res) => {
    offres.update(
        {
            publier: req.body.publier,
            publicationDate: req.body.publicationDate,
        }, {
        where: { id: req.params.id },
        returning: true
    })
        .then((result) => {
            console.log(`\n\n\n${result}\n\n\n`)
            if (result[1] === 0) throw "Any field is modified"
            res.status(HttpStatus.OK).json({
                message: "this offer is updated successfully",
                error: false
            })
        })
        .catch((error) => {
            console.log(error);
            res
                .status(HttpStatus.NOT_ACCEPTABLE)
                .send({ message: error, error: true });
        });

}
exports.getOffersByPostulator = (req, res) => {
    db.postulation.findAll({
        where: {userId:req.params.idUser},
        include:[
            {
                model: db.user,
            },{
                model: db.offre,
            }
        ]
    }).then(data => {
        // console.log(data)
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
}

exports.postuleToOffer = async(req,res) => {
    try {
        const offre = await db.offre.findByPk(req.params.offreId)
        .then(offre => {
            if(!offre) throw "Cet offre n'existe pas";
            return offre;
        })
        .catch(error => {
            throw error;
        });
        db.postulation.create({
            userId:req.body.userId,
            offreId: offre.dataValues.id,
            // dans 5 jours
            // testDate: new Date(new Date().getTime()+(5*24*60*60*1000))
        })
        .then((data) => {
            res
                .status(HttpStatus.CREATED)
                .send({data:data, message: "Vous avez postulé à cet offre", error: false});
        })
        .catch(err => {
            console.log(err);
            res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send({
                    message:
                        err.message || "Some error occurred while retrieving tutorials.",
                    error: true
                });            
        })   
    } catch (error) {
            res
                .status(HttpStatus.NOT_FOUND)
                .send({
                    message:
                        error.message || "Some error occurred while retrieving tutorials.",
                    error: true
                });
    }
}

exports.getUsersByOffer = async (req, res) => {
  try {    
    await Postulation.findAll({
      where: {offreId: req.params.offreId},
      include:
      [
        {
          model: User,
          attributes: ['id'],
          include: [{
            model: Profile,
            attributes: ['firstName','lastName']
          }]
        },
        {
          model: offres,
          attributes: ['post', 'publicationDate']
        }
      ]
    })
    .then(data => {
      res
          .status(HttpStatus.OK)
          .send({
            data: data,
            error:false
          });
    })
    .catch(err => {
        throw err;
    })
  } catch (error) {
    res
                .status(HttpStatus.NOT_FOUND)
                .send({
                    message:
                        error.message || "Some error occurred while retrieving tutorials.",
                    error: true
                });
  }
};

exports.updatePostulation = async (req, res) => {
  try {
    await Postulation.update(
       {
         testDate: req.body.testDate,
         testPassed: req.body.testPassed,
         step: req.body.step,
         totalPoint: req.body.totalPoint,
         note: req.body.note,
         decision: req.body.decision,
         observation: req.body.observation,
       },{
         where:{
           [Op.and]:[
              {userId: req.body.userId},
              {offreId: req.body.offreId}
            ]
          },
          returning: true
       })
    .then(async (result) => {
      if (result[1] === 0) throw "Any field is modified"
    //   const ioClient = io.connect("http://192.168.1.1:8080");
    //   ioClient.emit('update_postulation', {message:"Quelqu'un a modifié la postulation",offreId: req.body.offreId, userId: req.body.userId});
      // ioClient.on('socketClientID', (socketClientID)=> {
        // console.log('Connection to server established. SocketID is',socketClientID);
      // });
      // ioClient.emit('postulation_update', {offreId: req.body.offreId, userId: req.body.userId});
      res.status(HttpStatus.OK).json({
        data: await Postulation.findOne({
          where:{
            [Op.and]:[
             {userId: req.body.userId},
             {offreId: req.body.offreId}
           ]
         },
         include:
      [
        {
          model: User,
          attributes: ['id'],
          include: [{
            model: Profile,
            attributes: ['firstName','lastName']
          }]
        },
        {
          model: offres,
          attributes: ['post', 'publicationDate']
        }
      ]
        }),
        message: "this postulation is updated successfully",
        error: false
      })
     })
     .catch((error) => {
       throw error;
     })
  } catch (error) {
    console.log(error);
       res
                .status(HttpStatus.NOT_ACCEPTABLE)
                .send({ message: error, error: true });
  }
}

exports.findOneOfferById = async (req, res) => {
    try {        
        await offres.findOne({
        	where: {id: req.params.id},
        	include:
        	[{
            	model: db.blob,
            	include: [{ model: db.type_blob }],
           	
        	}]
        })
        .then((offre) => {
            res
                .status(HttpStatus.OK)
                .send({ data: offre, error: false });
        })
        .catch(error => {
            throw error;
        })
    } catch (error) {
        res
                 .status(HttpStatus.NOT_FOUND)
                 .send({ message: error.message, error: true });
    }
}

exports.getPostulationById = async (req, res) => {
    try {
        await Postulation.findOne({
            where:{
            [Op.and]:[
               {userId: req.params.userId},
               {offreId: req.params.offreId}
             ]
            },
            include:
            [
              {
                model: User,
                attributes: ['id'],
                include: [{
                  model: Profile,
                  attributes: ['firstName','lastName']
                }]
              },
              {
                  model: offres,
                  attributes: ['post', 'publicationDate']
              }
            ]
              })
            .then((postulation) => {
                res
                    .status(HttpStatus.OK)
                    .send({ data: postulation, error: false });
            })
            .catch((error) => {
                throw error;
            })
        } catch (error) {
            res
                    .status(HttpStatus.NOT_FOUND)
                    .send({ message: error.message, error: true });
        }
}

exports.checkUserHaveTestedOffer = async (req, res) => {
    try {
        await Postulation.count({where:{
            [Op.and]:[
               {userId: req.params.userId},
               {offreId: req.params.offreId},
               {testPassed:{[Op.gt]:0}}
             ]
           }})
           .then(count => {
            res
                .status(HttpStatus.OK)
                .send({ data: count, error: false });
           })
           .catch(error => {
               throw error;
           })
    } catch (error) {
        res
                 .status(HttpStatus.NOT_FOUND)
                 .send({ message: error.message, error: true });
    }
}
