const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: 0,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.profile = require("../models/profile.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.quiz = require("../models/quiz.model.js")(sequelize, Sequelize);
db.question = require("../models/question.model.js")(sequelize, Sequelize);
db.reponse = require("../models/reponse.model.js")(sequelize, Sequelize);
db.offre = require("../models/offre.model.js")(sequelize, Sequelize);
db.blob = require("../models/blob.model.js")(sequelize, Sequelize);
db.type_blob = require("../models/type_blob.model.js")(sequelize, Sequelize);
db.postulation = require("../models/postulation.model.js")(sequelize, Sequelize);
db.quiz_to_offer = require("../models/quiz_to_offer.model.js")(sequelize, Sequelize);
db.type_question = require("../models/type_question.model.js")(sequelize, Sequelize);
db.dossier = require("../models/dossier.model.js")(sequelize, Sequelize);
db.criteria_point_question = require("../models/criteria_point_question.model.js")(sequelize, Sequelize);
db.spontaneous = require("../models/spontaneous.model.js")(sequelize, Sequelize);
db.education = require("../models/education.model.js")(sequelize, Sequelize);
db.profession = require("../models/profession.model.js")(sequelize, Sequelize);
db.competence = require("../models/competence.model.js")(sequelize, Sequelize);
db.dossier_offer = require("../models/dossier_offer.model.js")(sequelize, Sequelize);
db.blobscv = require("../models/blobCV.model.js")(sequelize, Sequelize);
db.response_test = require("../models/response_test.model.js")(sequelize, Sequelize);
db.details_note = require("../models/details_note.model.js")(sequelize, Sequelize);

db.quiz.belongsTo(db.user, {
  through: db.offre
});
db.quiz.hasMany(db.question, { foreignKey:"quizId", onDelete:"CASCADE" });
db.quiz.belongsToMany(db.offre,{
  as:"offerInQuiz",
  through:db.quiz_to_offer,
  foreignKey:"quizzId",
  otherKey:"offreId"
})
db.question.belongsTo(db.quiz, {
  foreignKey: "quizId",
});
db.question.hasMany(db.reponse, {onDelete:"CASCADE", as: "options" });
db.dossier.belongsTo(db.user, {
  foreignKey: "userId",  
});
db.question.belongsTo(db.type_question, { foreignKey: "TypeQuestionId" });
db.question.hasMany(db.criteria_point_question, {foreignKey: "questionId", onDelete:"CASCADE"});
// db.offre.hasMany(db.question, { as: "questions" });
db.question.hasMany(db.response_test,{foreignKey:"questionId"});

db.offre.hasMany(db.blob, {
  onDelete:"CASCADE",
  foreignKey: "OffreId"
});

db.offre.belongsTo(db.user, {
  as: "creator",
  foreignKey: "userId"
});

db.offre.belongsToMany(db.user,{
  as: "offer_postuled",
  through: db.postulation,
  foreignKey:"offreId",
  otherKey:"userId"  
});
db.offre.belongsToMany(db.quiz,{
  as:"quizInOffer",
  through:db.quiz_to_offer,
  foreignKey:"offreId",
  otherKey:"quizzId"
});
db.offre.belongsToMany(db.dossier,{
  as:"folder",
  through:db.dossier_offer,
  foreignKey:"offreId",
  otherKey:"dossierId"
});
// db.offre.hasMany(db.response_test,{
//   through:db.postulation,
//   foreignKey:"offreId"
// })
// postulation
db.postulation.belongsTo(db.user);
db.postulation.belongsTo(db.offre);
db.postulation.hasMany(db.response_test,{
  foreignKey:"offreId",
  otherKey:"userId",
  onDelete:"CASCADE"
    
});
// quiz_to_offer
db.quiz_to_offer.belongsTo(db.quiz);
db.quiz_to_offer.belongsTo(db.offre);
// dossier_offer
db.dossier_offer.belongsTo(db.dossier);
db.dossier_offer.belongsTo(db.offre);

db.blob.belongsTo(db.offre, {as:'offre', foreignKey: "OffreId", });
db.type_blob.hasMany(db.blob, {
  foreignKey: "TypeBlobId"
});
db.blob.belongsTo(db.type_blob, {
  foreignKey: "TypeBlobId"
});
db.reponse.belongsTo(db.question, {
  foreignKey: "questionId",
  as: "options",
});
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});
db.user.hasOne(db.profile,{
  foreignKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});
db.user.hasMany(db.quiz, { foreignKey: "userId" })
db.user.hasMany(db.offre, { foreignKey: "userId" })

db.user.belongsToMany(db.offre,{
  as:"postulator",
  through: db.postulation,
  foreignKey:"userId",
  otherKey:"offreId"  
});

// db.user.hasMany(db.response_test,{
//   through:db.postulation,
//   foreignKey:"userId"
// })
db.profile.belongsTo(db.user, {foreignKey: "userId"});

db.type_question.hasMany(db.question,{foreignKey: "TypeQuestionId"});
db.criteria_point_question.belongsTo(db.question, {foreignKey: "questionId"});
db.criteria_point_question.hasOne(db.details_note, {foreignKey: "critereId",onDelete:"CASCADE"});

db.competence.belongsTo(db.spontaneous, { foreignKey: "spontaneousId", });
db.education.belongsTo(db.spontaneous, { foreignKey: "spontaneousId", });
db.profession.belongsTo(db.spontaneous, { foreignKey: "spontaneousId", });


db.spontaneous.hasMany(db.competence, { foreignKey:"spontaneousId" });
db.spontaneous.hasMany(db.education, { foreignKey:"spontaneousId" });
db.spontaneous.hasMany(db.profession, { foreignKey:"spontaneousId" });

db.dossier.belongsToMany(db.offre,{
  as:"offres",
  through:db.dossier_offer,
  foreignKey:"dossierId",
  otherKey:"offreId"
})
db.spontaneous.hasMany(db.blobscv, { foreignKey: "spontaneousId" });
db.blobscv.belongsTo(db.spontaneous, { foreignKey: "spontaneousId", });
db.blobscv.belongsTo(db.type_blob, { foreignKey: "TypeBlobId" });
db.type_blob.hasMany(db.blobscv, { foreignKey: "TypeBlobId" });



db.response_test.belongsTo(db.question, {
  foreignKey:"questionId"
})

// db.response_test.belongsTo(db.user, {
//   foreignKey:"userId",
//   as: "UserCandidat"
// })

db.response_test.belongsTo(db.offre, {
  through:db.postulation,
  foreignKey:"offreId",
})
db.response_test.belongsTo(db.user, {
  through:db.postulation,
  foreignKey:"userId",
});
db.response_test.hasMany(db.details_note, {
  foreignKey:"responseTestId",
  onDelete:"CASCADE"
});
db.details_note.belongsTo(db.criteria_point_question,{
  foreignKey:"critereId",
})
db.details_note.belongsTo(db.response_test,{
  foreignKey:"responseTestId",
})
db.ROLES = ["candidat", "admin", "recruteur"];

module.exports = db;
