var DataTypes = require('sequelize/lib/data-types');
const dataTypes = require('sequelize/lib/dialects/postgres/data-types');
console.log(dataTypes)
module.exports = (sequelize, Sequelize) => {
  const Quiz = sequelize.define("quizz", {
    question: {
      type: Sequelize.STRING
    },
    type: {
      type: Sequelize.STRING
    },
    userId: {
      type: Sequelize.INTEGER
    }
  }, { timestamps: false, });

  return Quiz;
};