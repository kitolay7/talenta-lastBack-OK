const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
  const profession = sequelize.define("profession", {
    titre: {
      type: Sequelize.STRING
    },
    nomSociete: {
      type: Sequelize.STRING
    },
    resume: {
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
  return profession;
}
