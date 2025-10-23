module.exports = (sequelize, Sequelize) => {
    const Dossier = sequelize.define("dossiers", {
      titre: {
        type: Sequelize.STRING
      },
      fiche: {
        type: Sequelize.TEXT
      },
      auteur: {
        type: Sequelize.STRING
      },
	archived: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
      remarque: {
        type: Sequelize.TEXT,
        defaultValue: null
      },
    }, { timestamps: false, });
  
    return Dossier;
  };
  
