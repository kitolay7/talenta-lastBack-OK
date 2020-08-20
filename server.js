const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const fs = require("fs");
const path = require("path");
const config = require("./app/config/db.config");

app.use(cors());
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  // res.setHeader('Access-Control-Allow-Origin', 'http://154.126.92.194:4200/');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  

  // Pass to next layer of middleware
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;
const TypeBlob = db.type_blob;
const TypeQuestion = db.type_question;

const mkdirpSync = function (dirPath) {
  const parts = dirPath.split(path.sep)
  // For every part of our path, call our wrapped mkdirSync()
  // on the full path until and including that part
  for (let i = 1; i <= parts.length; i++) {
    try {
      fs.mkdirSync(path.join.apply(null, parts.slice(0, i)))
    } catch (err) {
      if (err.code !== "EEXIST") throw err
    }
  }
}


// CREATE DATABASE IF NOT EXIST
const mysql_connection = require('mysql2/promise');
const { count } = require("console");


mysql_connection.createConnection({
  user: config.USER,
  password: config.PASSWORD
}).then((connection) => {
  connection.query(`CREATE DATABASE IF NOT EXISTS ${config.DB};`).then(() => {
    // Safe to use sequelize now
    console.info("Database create or successfully checked");

    mkdirpSync('uploads/videos/');
    // CREATE TABLES IF NOT EXIST
    db.sequelize.sync().then((result) => {
      console.log(`\n\nre-sync db.\n\n`);
      db.type_blob.count().then(count => {
        if (count < 1) {
          initalizeBlob();
        }
      })
      db.role.count().then(count => {
        if (count < 1) {
          initalizeRole();
        }
      })
      db.type_question.count().then(count => {
        if (count < 1) {
          initalizeTypeQuestion();
        }
      })
    }).catch((err) => {
      console.log(err, "Some problems with database connection!!!");
    });
  })
}).catch((error) => {
  console.log(error);
})


/* db.sequelize.sync({ force: true }).then(() => {
  console.log('Drop and Resync Database with { force: true }');
  initalizeBlob();
  initalizeRole();
}); */

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

app.use(express.static('uploads'));
// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require("./app/routes/quiz.routes")(app);
require("./app/routes/test_mailer_routes")(app);
// set port, listen for requests
const initalizeRole = () => {
  Role.create({
    id: 1,
    name: "admin"
  });

  Role.create({
    id: 2,
    name: "candidat"
  });

  Role.create({
    id: 3,
    name: "recruteur"
  });
}

const initalizeBlob = () => {
  // intialiser type blob
  TypeBlob.create({
    wording: "logo"
  });
  TypeBlob.create({
    wording: "video"
  });
  TypeBlob.create({
    wording: "photo_animés"
  });
  TypeBlob.create({
    wording: "diaporama"
  });
}

const initalizeTypeQuestion = () => {
  // intialiser type blob
  TypeQuestion.create({
    wording: "Vrai ou Faux"
  });
  TypeQuestion.create({
    wording: "Choix multiple"
  });
  TypeQuestion.create({
    wording: "Classement hiérarchique"
  });
  TypeQuestion.create({
    wording: "Rédaction"
  });
  TypeQuestion.create({
    wording: "Audio"
  });
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

