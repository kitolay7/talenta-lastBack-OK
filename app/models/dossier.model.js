module.exports = (sequelize, Sequelize) => {
    const Dossier = sequelize.define("dossier", {
      titre: {
        type: Sequelize.STRING
      },
      fiche: {
        type: Sequelize.STRING
      },
      auteur: {
        type: Sequelize.STRING
      },
      remarque: {
        type: Sequelize.STRING
      },
    }, { timestamps: false, });
  
    return Dossier;
  };
  