const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
  const type_blob = sequelize.define("type_blobs", {
    wording: {
      type: Sequelize.STRING,
      unique: true
    }
  }, { timestamps: false })
  return type_blob;
}