module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("spontaneous", {
    
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      birthday: {
        type: Sequelize.DATE
      },
      email: {
        type: Sequelize.STRING
      },
      numTel: {
        type: Sequelize.STRING
      },
      idSkype: {
        type: Sequelize.STRING
      },
      idWhatsapp: {
        type: Sequelize.STRING
      },
      originCountry: {
        type: Sequelize.BOOLEAN
      },
      actualCountry: {
        type: Sequelize.STRING
      },
      actualCity: {
        type: Sequelize.STRING
      },
      secteur: {
        type: Sequelize.STRING
      },
      traiter: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
    }, {
      freezeTableName: true,
    });
  
    return User;
  };
  
