const { verifySignUp } = require("../middleware");
const controller = require("../controllers/quiz.controller");
const offreControler = require("../controllers/offre.controller");
const quizControler = require("../controllers/quiz.controller");
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
      console.log(req.files);

      if (file.mimetype.includes('video')) {
        cb(null, 'uploads/videos');
      } else if (file.mimetype.includes('image')) {
        cb(null, 'uploads/');
      }
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });
  app.post("/quiz", controller.create);
  app.post("/createReponse", controller.createReponse);
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
  }]
  ), offreControler.createOffre);
  app.get("/getOffer/:id", offreControler.getOfferById);
  app.get("/getofferByPays/:pays", offreControler.getOfferByPays);
  app.get("/getAllOfferPubl", offreControler.findAllPublished);
  app.get("/getAllOffer", offreControler.findAllOffer);
  app.get("/getAllOfferbyUser/:idUSer", offreControler.findAllOfferbyIdUser);
  app.get("/getdetailOffer/:idUSer/:idOffer", offreControler.findOneOfferbyId);
  app.get("/findReponse/:id", controller.findQuestionbyId);
  app.get("/findOffer/:id", controller.findOne);
  app.get("/getOfferArchived", offreControler.getOfferArchived);
  app.put("/updateArchive/:id", offreControler.updateOfferStatusArchived);
  app.put("/updatePublier/:id", offreControler.updateOfferStatusPublished);
  app.post("/offre/:offreId/postule", offreControler.postuleToOffer);
  app.get("/offre/:offreId/users", offreControler.getUsersByOffer);
  app.get("/offrePostuled", offreControler.getOffersByPostulator);
  app.get("/offer/:id/quiz/", quizControler.findOneByOffer);
};
