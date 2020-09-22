const db = require("../models");
const { QueryTypes, Sequelize } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  const QuizToOffer = sequelize.define("quiz_to_offers", {},{
    timestamps: true,freezeTableName: true
  });
  return QuizToOffer;
}