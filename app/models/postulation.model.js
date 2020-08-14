module.exports = (sequelize, Sequelize) => {
    const Postulation = sequelize.define("postulations", {
    }, {
        timestamps: false,
        freezeTableName: true,
    });
  
    return Postulation;
  };