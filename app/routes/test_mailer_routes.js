const { sendMail, sendMailGroup } = require("../middleware")
module.exports = (app) => {
  app.post("/test_mailer", sendMail);
  app.post("/send_mail_group", sendMailGroup);
}