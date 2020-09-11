module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("spontaneous", {
    
    /*
  		(this.firstName)
  		(this.lastName)
  		(this.birthday) 
  		(this.email)
  		(this.numTel)
  		(this.idSkype) 
  		(this.idWhatsapp) 
  		(this.originCountry)
  		(this.actualCountry) 
  		(this.actualCity) 
  		this.competences,
  		(this.secteur)
  		this.educations,
  		this.profession,
    */
    
    
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      ville: {
        type: Sequelize.STRING
      },
      pays: {
        type: Sequelize.STRING
      },
      numTel: {
        type: Sequelize.STRING
      },
      metierActuel: {
        type: Sequelize.STRING
      },
      anneesExperiences: {
        type: Sequelize.STRING
      },
      niveauEtudes: {
        type: Sequelize.STRING
      },
      diplomes: {
        type: Sequelize.STRING
      },
      specialisations: {
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
  
