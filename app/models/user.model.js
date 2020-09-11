module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    confirmed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
  }, {
    freezeTableName: true,
  });

  return User;
};
