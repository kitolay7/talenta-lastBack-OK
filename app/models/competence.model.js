const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
  const competence = sequelize.define("competence", {
    name: {
      type: Sequelize.STRING
    },
    spontaneousId: {
      type: Sequelize.INTEGER,
    },

  }, { timestamps: false })
  return competence;
}
