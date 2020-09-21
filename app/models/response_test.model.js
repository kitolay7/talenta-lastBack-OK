module.exports = (sequelize, Sequelize) => {
  const responseTest = sequelize.define("response_test", {
      answers: {
          type: Sequelize.TEXT
      },
      filename: {
          type: Sequelize.STRING
      },
      rang: {
          type: Sequelize.INTEGER
      },
  }, { timestamps: false,});

  return responseTest;
};
