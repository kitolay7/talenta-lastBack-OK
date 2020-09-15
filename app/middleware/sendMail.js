const nodemailer = require("nodemailer");
const HttpStatus = require('http-status-codes');
require('dotenv/config');
const sendMail = (req, res, next) => {
	
	console.log(req);
  const transporter = nodemailer.createTransport({
  	/*
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
    */
    host:  process.env.SMTP_HOST,
  	port:  process.env.SMTP_PORT,
  	secure: false,
  	requireTLS: true,
  	auth: {
    	user:  process.env.SMTP_USER,
    	pass:  process.env.SMTP_PASSWORD,
  	}
  });
  // verify connection configuration
  transporter.verify((error, success) => {
    if (error) {
      throw error;
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  let mail = {
    from: process.env.FROM_EMAIL,
    to: req.body.email_recipient,
    subject: req.body.email_subject,
    html: req.body.email_content
  };

  transporter.sendMail(mail, (error, response) => {
    if (error) {
      console.log("Erreur lors de l'envoie du mail!");
      console.log(error);
      res
        .status(HttpStatus.BAD_REQUEST)
        .send({
          error: error,
          message: "Erreur lors de l'envoi du email!"
        });
    } else {
      console.log("Mail envoyé avec succès!")
      res
        .status(HttpStatus.OK)
        .send({ message: "Mail envoyé avec succès!" });
    }
    transporter.close();
  });
}

module.exports = sendMail;
