const { sendMailRegister } = require('./../middleware/sendMail');
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

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
    profile_photo_path: {
      type: Sequelize.STRING
    },
    confirmed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
  }, {
    freezeTableName: true,
  });

  User.afterCreate( async currentUser => {
    console.log(currentUser);
    
    var token = jwt.sign({ id: currentUser.id }, config.secret, {
      expiresIn: 864000 // 24 hours
    });
    sendMailRegister(currentUser, token).catch(error => {throw error});
  })

  return User;
};
