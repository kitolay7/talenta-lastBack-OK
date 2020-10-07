const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const {sendMail, sendMailGroup} = require("./sendMail");
module.exports = {
  authJwt,
  verifySignUp,
  sendMail,
  sendMailGroup
};
