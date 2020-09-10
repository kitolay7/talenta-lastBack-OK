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
db.type_question = require("../models/type_question.model.js")(sequelize, Sequelize);
db.dossier = require("../models/dossier.model.js")(sequelize, Sequelize);
db.criteria_point_question = require("../models/criteria_point_question.model.js")(sequelize, Sequelize);

db.quiz.belongsTo(db.offre, {foreignKey:"offreId"});
db.quiz.belongsTo(db.user, {
  through: db.offre
});
// db.quiz.hasMany(db.question, { foreignKey:"quizId" });
// db.question.belongsTo(db.quiz, {
//   foreignKey: "quizId",
// });
db.question.hasMany(db.reponse, {onDelete:"CASCADE", as: "options" });
db.question.belongsTo(db.offre, {
  foreignKey: "offreId",
  as: "questions",
});
db.dossier.belongsTo(db.offre, {
  foreignKey: "offreId",  
});
db.dossier.belongsTo(db.user, {
  foreignKey: "userId",  
});
db.question.belongsTo(db.type_question, { foreignKey: "TypeQuestionId" });
db.question.hasMany(db.criteria_point_question, {foreignKey: "questionId", onDelete:"CASCADE"});
db.offre.hasMany(db.question, { as: "questions" });
db.offre.hasMany(db.blob, {
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
db.offre.hasMany(db.quiz,{foreignKey:"offreId"});
// postulation
db.postulation.belongsTo(db.user);
db.postulation.belongsTo(db.offre);

db.blob.belongsTo(db.offre, { foreignKey: "OffreId", });
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
db.profile.belongsTo(db.user, {foreignKey: "userId"});

db.type_question.hasMany(db.question,{foreignKey: "TypeQuestionId"});
db.criteria_point_question.belongsTo(db.question, {foreignKey: "questionId"});

db.ROLES = ["candidat", "admin", "recruteur"];

module.exports = db;
