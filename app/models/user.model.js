module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    numTel: {
      type: Sequelize.STRING
    },
    pays: {
      type: Sequelize.STRING
    },
    codePostal: {
      type: Sequelize.STRING
    },
    societe: {
      type: Sequelize.STRING
    }
  }, {
    freezeTableName: true,
  });

  return User;
};
