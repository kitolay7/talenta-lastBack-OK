module.exports = (sequelize, Sequelize) => {
    const Dossier = sequelize.define("dossier", {
      titre: {
        type: Sequelize.STRING
      },
      fiche: {
        type: Sequelize.TEXT
      },
      auteur: {
        type: Sequelize.STRING
      },
      remarque: {
        type: Sequelize.TEXT,
        defaultValue: null
      },
    }, { timestamps: false, });
  
    return Dossier;
  };
  
