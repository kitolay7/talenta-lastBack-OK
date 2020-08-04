const nodemailer = require("nodemailer");
require('dotenv/config');
const sendMail = (req, res, next) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
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
      from: process.env.EMAIL,
      to: req.body.email_recipient,
      subject: req.body.email_subject,
      html: req.body.email_content
    };

    transporter.sendMail(mail, (error, response) => {
      if (error) {
        console.log("Erreur lors de l'envoie du mail!");
        console.log(error);
        throw error;
      } else {
        console.log("Mail envoyé avec succès!")
        res.status(200).json({ message: "Mail envoyé avec succès!" });
      }
      transporter.close();
    });
  } catch (error) {
    res.status(400).json({
      error: error
    });
  }

}

module.exports = sendMail;