const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const spontaneousController = require("../controllers/spontaneous.controller");
const multer = require('multer');
const upload = multer({ dest: './uploads/' });

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });
  const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {

      if (file.mimetype.includes('application')) {
        cb(null, 'uploads/cv');
      }
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });

  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );
  app.get(
    "/api/test/userinfo/:idUser",
    [authJwt.verifyToken],
    controller.userInfo
  );
  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.post("/createSpontaneous", multer({storage: fileStorage}).fields([{
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
  ), spontaneousController.createSpontaneous);
  app.get("/getAllSpontaneous", spontaneousController.findAllSpontaneous);
  app.get("/getSpontaneousNonTraiter", spontaneousController.findSpontaneousNonTraiter);
  app.get("/getSpontaneousById/:spontaneousId", spontaneousController.findOneSpontaneous);
  app.put("/updateSpontaneousTraiter/:id", spontaneousController.updateSpontaneousTraiter);
};
