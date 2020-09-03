const db = require("../models");
const { QueryTypes } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    const Postulation = sequelize.define("postulations", {
			index:{
				type: Sequelize.INTEGER,
				unique:true
			},
			testDate: {
				type: Sequelize.DATE
			},
			testPassed:{
				// 0: user will pass
				// 1: user passing
				// 2: user will passed
				type:Sequelize.INTEGER,
				defaultValue: 0
			},
			totalPoint:{
			// abort|will passed|passing
				type: Sequelize.INTEGER,
				defaultValue: 0
			},
			
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
	
		Postulation.beforeCreate(async postulation => {
			await sequelize.query("select GetSequenceVal(?,?) as index_postulation",{replacements:['postulation_sequence',1], type:QueryTypes.SELECT})
			.then(response => {
				console.log(`\n\nRESPONSE ${JSON.stringify(response)}\n\n`);
				postulation.index = response[0].index_postulation
			});
		})
    return Postulation;
  };