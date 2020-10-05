const { verifySignUp } = require("../middleware");
const controller = require("../controllers/quiz.controller");
const offreControler = require("../controllers/offre.controller");
const quizControler = require("../controllers/quiz.controller");
const folderController = require("../controllers/dossier.controller");
const multer = require('multer');
const upload = multer({ dest: './uploads/' });
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      console.log(file);
      if (file.mimetype.includes('video')) {
        cb(null, 'uploads/videos');
      } else if (file.mimetype.includes('image')) {
        cb(null, 'uploads/');
      }else if (file.mimetype.includes('stream')) {
        cb(null, 'uploads/audios');
      }
    },
    filename: (req, file, cb) => {
      // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.originalname);
    }
  });
  app.post("/quiz", controller.create);
  app.post("/createReponse", controller.createReponse);
  app.post("/createFolder", folderController.addFolder);
  app.post("/createOffre", multer(
    {
      storage: fileStorage,
    }
  ).fields([{
    name: 'video', maxCount: 1
  }, {
    name: 'logo', maxCount: 1
  }, {
    name: 'photo_animes', maxCount: 8
  }, {
    name: 'diaporamas', maxCount: 8
  }, {
    name: 'cv', maxCount: 1
  }]
  ), offreControler.createOffre);
  app.get("/getOffer/:id", offreControler.getOfferById);
  app.get("/getofferByPays/:pays", offreControler.getOfferByPays);
  app.get("/getAllOfferPubl", offreControler.findAllPublished);
  app.get("/getAllOffer", offreControler.findAllOffer);
  app.get("/getAllOfferbyUser/:idUSer", offreControler.findAllOfferbyIdUser);
  app.get("/getOffreUser/:idUSer", offreControler.findAllOfferIdUser);
  app.get("/getdetailOffer/:idUSer/:idOffer", offreControler.findOneOfferbyId);
  app.get("/findReponse/:id", controller.findQuestionbyId);
  app.get("/findOffer/:id", offreControler.findOneOfferById);
  app.get("/getOfferArchived", offreControler.getOfferArchived);
  app.put("/updateArchive/:id", offreControler.updateOfferStatusArchived);
  app.put("/updatePublier/:id", offreControler.updateOfferStatusPublished);
  app.post("/offre/:offreId/postule", offreControler.postuleToOffer);
  app.get("/offre/:offreId/users", offreControler.getUsersByOffer);
  app.get("/offrePostuled/:idUser", offreControler.getOffersByPostulator);
  app.get("/offreCandidat/:idUser", offreControler.listingOffreCandidat);
  app.get("/offer/:id/quiz/", quizControler.findOneByOffer);
  app.put("/postulation/update", offreControler.updatePostulation);
  app.get("/postulation/users/:userId/offres/:offreId", offreControler.getPostulationById);
  app.get("/checktest/users/:userId/offres/:offreId", offreControler.checkUserHaveTestedOffer);
  app.get("/getAllFolder/:idUser", folderController.getAllFolderUser);
  app.get("/findFolder/:id", folderController.getOneFolder);
  app.put("/offerFolder", offreControler.updateOffreDossier);
  app.put("/offreRemarque", folderController.updateRemarque);
  app.get("/quizs",controller.findAllQuiz);
  app.get("/quiz/:quizId", controller.findOneQuizById);
  app.put("/quizs/:quizId/update", controller.updateQuizContent);
  app.get("/users/:userId/offresPublished", offreControler.getOfferByCreatorPublished);
  app.put("/quizzs/state/:id/update", controller.updateQuizStatePublished);
  app.get("/users/:userId/offres", offreControler.getOfferByCreator);
  app.post("/postulation/users/:userId/offres/:offreId/audio/upload", multer(
    {
      storage: fileStorage,
    }
  ).fields([{
    name: 'fileAudio', maxCount: 1
  }]
  ),quizControler.uploadMediaAudio);
  app.post("/postulation/users/:userId/offres/:offreId/responses",multer(
    {
      storage: fileStorage,
    }
  ).fields([{
    name: 'fileAudio', maxCount: 1
  },
  {
    name: 'fileVideo', maxCount: 1
  }
]
  ), quizControler.createResponseQuizz);
  app.get("/postulation/users/:userId/offres/:offreId/responses", quizControler.getResponseTestByPostulation);
  app.put("/postulation/users/:userId/offres/:offreId/update", quizControler.updateResponseQuizz);
  app.get("/users/:userId/lastLogo", offreControler.getLastBlobLogo);
  app.put("/postulation/users/:userId/offres/:offreId/responseNote", quizControler.updateResponsePostulationMultiple);
  app.delete("/offres/:id/delete", quizControler.destroyOffre)
};
