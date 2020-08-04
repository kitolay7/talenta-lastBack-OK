const { sendMail } = require("../middleware")
module.exports = (app) => {
  app.post("/test_mailer", (req, res, next) => {
    sendMail(req, res, next);
  });
}