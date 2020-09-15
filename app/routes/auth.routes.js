const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.register
  );

  app.post("/api/auth/signin", controller.signin);
  app.put("/api/auth/updateprofile", controller.updateProfile);
  
  
  // ********** ESSAI CONFIRM MAIL ***************
  //app.post("/signup", controller.reg );
  //app.post("/signin", controller.log );
  app.get("/confirmation/:token", controller.confirm );
  
};
