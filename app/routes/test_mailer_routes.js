const { sendMail } = require("../middleware")
module.exports = (app) => {
  app.post("/test_mailer", sendMail);
}