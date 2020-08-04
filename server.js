const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require('mysql2');
const app = express();


// deprecated
// var mailer = require("nodemailer");
// var smtpTransport = mailer.createTransport("SMTP", {
//   service: "Gmail",
//   auth: {
//     user: "manolotsoadaniel@gmail.com",
//     // pass: "fnoaculrfrkeozju!"
//     pass: "Itu1506!"
//   }
// });
// var mail = {
//   from: "manolotsoadaniel@gmail.com",
//   to: "manolotsoarazafindrakoto@gmail.com",
//   subject: "Test envoi email",
//   html: "<b>TEST</b>"
// }

// smtpTransport.sendMail(mail, function (error, response) {
//   if (error) {
//     console.log("Erreur lors de l'envoie du mail!");
//     console.log(error);
//   } else {
//     console.log("Mail envoyé avec succès!")
//   }
//   smtpTransport.close();
// });


// NEWEST
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: "manolotsoadaniel@gmail.com",
    pass: "Itu1506!"
  }
});
// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

var mail = {
  from: "manolotsoadaniel@gmail.com",
  to: "manolotsoarazafindrakoto@gmail.com",
  subject: "Test envoi email",
  html: "<b>👻 HELLO</b>"
};

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

transporter.sendMail(mail, function (error, response) {
  if (error) {
    console.log("Erreur lors de l'envoie du mail!");
    console.log(error);
  } else {
    console.log("Mail envoyé avec succès!")
  }
  transporter.close();
});









console.log(`\n\n\n`);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;
db.sequelize.sync().then(() => {
  console.log("Drop and re-sync db.");
}).catch((err) => {
  console.log(err, "Some problems with database connection!!!");
});
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require("./app/routes/quiz.routes")(app);
// set port, listen for requests
function initial() {
  Role.create({
    id: 1,
    name: "user"
  });

  Role.create({
    id: 2,
    name: "moderator"
  });

  Role.create({
    id: 3,
    name: "admin"
  });
}
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

