const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const fs = require("fs");
const path = require("path");
const config = require("./app/config/db.config");
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Importer = require('mysql-import');
const cvRoutes = require('./app/routes/cv.routes');

app.use(cors());
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'localhost:4200');
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

app.use('/cv', express.static(path.join(__dirname, 'uploads/cv')));

app.use('/api/cv', cvRoutes);

require("./app/routes/admin.settings.routes")(app);

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
const { count, error } = require("console");
const { response } = require("express");
const { resolve } = require("path");

try {
  mysql_connection.createConnection({
    user: config.USER,
    password: config.PASSWORD,
    multipleStatements: true,
    host:config.HOST,
    port: config.PORT
  }).then(async (connection) => {
    connection.query(`CREATE DATABASE IF NOT EXISTS ${config.DB};`).then(async (connection) => {
      const host = config.HOST;
      const user = config.USER;
      const password = config.PASSWORD;
      const database = config.DB;
      const importer = new Importer({host, user, password, database});
      // Safe to use sequelize now
      console.info("Database create or successfully checked");
      
      // importer.import('script.sequence.sql').then(async()=>{
      //   var files_imported = importer.getImported();
      //   console.log(`${files_imported.length} SQL file(s) imported.`);
      //   await db.sequelize.query("CALL CreateSequence( :sSeqName, :iSeqValue )",{replacements:{sSeqName:"postulation_sequence",iSeqValue:0}}).then(response => {
      //     console.log(`\n\nCREATION postulation's index\n\n`);
      //   });
      // }).catch((err)=>{
      //   console.error(err);
      //   throw err;
      // });
            
      // connection.query(`CREATE SEQUENCE postulation_sequence_id IF NOT EXISTS;`)
      mkdirpSync('uploads/videos/');
      mkdirpSync('uploads/audios/');
      mkdirpSync('uploads/cv/');
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
        throw err;
      });
    })
  }).catch((error) => {
    throw error
  })
} catch (error) {
  console.log(error);
  throw error;
}


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
const initalizeRole = async() => {
  await Role.create({
    id: 1,
    name: "admin"
  });

  await Role.create({
    id: 2,
    name: "candidat"
  });

  await Role.create({
    id: 3,
    name: "recruteur"
  });
}

const initalizeBlob = async() => {
  // intialiser type blob
  TypeBlob.create({
    wording: "logo"
  })
  .then(()=>{
    TypeBlob.create({
      wording: "video"
    })
    .then(()=>{
      TypeBlob.create({
        wording: "photo_animés"
      })
      .then(()=>{
        TypeBlob.create({
          wording: "diaporama"
        })
        .then(() => {
          TypeBlob.create({
            wording: "cv"
          })
          .then(() => {
            console.log(`toutes les types blobs sont tous insérés`);
          })
          .catch(error => {throw error});
        })
        .catch(error => {throw error});
      })
      .catch(error => {throw error});
    })
    .catch(error=>{
      throw error;
    })
  })
  .catch(error=>{throw error});
}

const initalizeTypeQuestion = async() => {
  // intialiser type blob
  TypeQuestion.create({
    wording: "Vrai ou Faux"
  }).then(()=> {
    // console.log(type_question);
    TypeQuestion.create({
      wording: "Choix multiple"
    })
    .then(() => {
      TypeQuestion.create({
        wording: "Classement hiérarchique"
      })
      .then(() => {
        TypeQuestion.create({
          wording: "Rédaction"
        })
        .then(() => {
          TypeQuestion.create({
            wording: "Audio"
          }).then(() => {
            TypeQuestion.create({
              wording: "Video"
            })
            .then(() => {
              console.log(`toutes les types de questions sont tous insérés`);
            })
            .catch(error => {throw error});
          })
        })
        .catch(error=>{throw error});
      })
      .catch(error => {throw error});
    })
    .catch(error => {throw error});
  })
  .catch(error => {throw error});
}

const PORT = process.env.PORT || 8181;
const server = http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
io.on("connection", (socket) => {
  console.log('Client connected at '+new Date()+' with socket ID: '+ socket.client.id);
  // io.emit('socketClientID', socket.client.id);
  socket.on('update_postulation', (response) => {
    // broadcastena any @dashboard
      // console.log(response);
      io.emit(`alert_update_offre_${response.data.offreId}`, JSON.stringify(response));
  });
  socket.on('user_postule', (response) => {
    console.log(`\nquelqu'un a postulé\n`);
    io.emit(`user_postuled_offer_${response.offreId}`, JSON.stringify(response));
  })
});
