module.exports = (sequelize, Sequelize) => {
    const Postulation = sequelize.define("postulations", {
			testDate: {
				type: Sequelize.DATE
			},
			testPassed:{
				// 0: user will pass
				// 1: user passing
				// 2: user will passed
				type:Sequelize.BOOLEAN,
				defaultValue: false
			},
			// notation:{
			// abort|will passed|passing
			// 	type: Sequelize.INTEGER
			// },
			admissibility:{
				type:Sequelize.INTEGER,
				defaultValue: 2
				// 2: user will pass (en attente)
				// 1: user passing
				// 0: aborting
			},
			note:{
				type: Sequelize.INTEGER,
				defaultValue: 0
			},
			decision: {
				type: Sequelize.STRING,
				defaultValue: "En attente"
			},
			observation: {
				type: Sequelize.STRING
			}
    }, {
        timestamps: false,
        freezeTableName: true,
    });
  
    return Postulation;
  };