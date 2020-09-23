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
      pointWin:{
          type: Sequelize.INTEGER,
          defaultValue:0
      },
      pointLost:{
        type: Sequelize.INTEGER,
        defaultValue:0
      },
      grid:{
        type: Sequelize.INTEGER,
        defaultValue:0
      }

  }, { timestamps: false,});

  return responseTest;
};
