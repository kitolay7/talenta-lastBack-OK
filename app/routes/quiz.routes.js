const { verifySignUp } = require("../middleware");
const controller = require("../controllers/quiz.controller");
const offreControler = require("../controllers/offre.controller");
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
      if (file.mimetype.includes('video')) {
        cb(null, 'uploads/videos');
      } else if (file.mimetype.includes('image')) {
        cb(null, 'uploads/');
      }
    },
    filename: (req, file, cb) => { // naming file
      cb(null, (new Date).valueOf() + file.originalname);
    }
  });
  app.post("/quiz", controller.create);
  app.post("/createReponse",controller.createReponse);
  app.post("/createOffre", multer(
    {
      storage: fileStorage,
    }
  ).fields([{
    name: 'video', maxCount: 1
  }, {
    name: 'logo', maxCount: 1
  }, {
    name: 'photoAnime', maxCount: 8
  }]
  ), offreControler.createOffre);
  app.get("/getOffer/:id", offreControler.getOfferById);
  app.get("/getAllOffer", offreControler.findAllPublished);
  app.get("/findReponse/:id", controller.findQuestionbyId);
};
