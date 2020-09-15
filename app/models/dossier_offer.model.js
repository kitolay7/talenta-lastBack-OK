const db = require(".");
const { QueryTypes, Sequelize } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  const DossierOffer = sequelize.define("dossier_offers", {},{
    timestamps: true,freezeTableName: true
  });
  return DossierOffer;
}