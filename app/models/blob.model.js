const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
  const blob = sequelize.define("blobs", {
    path: {
      type: Sequelize.STRING
    },
    extension: {
      type: Sequelize.STRING
    },
    OffreId: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    TypeBlobId: {
      type: Sequelize.INTEGER
    }

  }, { timestamps: false })
  return blob;
}