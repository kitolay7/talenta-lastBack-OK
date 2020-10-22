const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const {sendMail,sendMailRegister, sendMailGroup} = require("./sendMail");
module.exports = {
  authJwt,
  verifySignUp,
  sendMail,
  sendMailRegister,
  sendMailGroup
};
