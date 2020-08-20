var DataTypes = require('sequelize/lib/data-types');
const dataTypes = require('sequelize/lib/dialects/postgres/data-types');
console.log(dataTypes)
module.exports = (sequelize, Sequelize) => {
  const Quiz = sequelize.define("quizzs", {
    name: {
      type: Sequelize.STRING
    },
    fiche_dir: {
      type: Sequelize.STRING
    },
    author_dir:{
      type: Sequelize.STRING
    }
  }, { timestamps: false, });

  return Quiz;
};