const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
  const education = sequelize.define("education", {
    titre: {
      type: Sequelize.STRING
    },
    specialisation: {
      type: Sequelize.STRING
    },
    diplome: {
      type: Sequelize.STRING
    },
    startDate: {
      type: Sequelize.DATE
    },
    endDate: {
      type: Sequelize.DATE
    },
    spontaneousId: {
      type: Sequelize.INTEGER,
    },

  }, { timestamps: false })
  return education;
}
