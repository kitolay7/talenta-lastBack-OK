module.exports = (sequelize, Sequelize) => {
    const reponse = sequelize.define("reponses", {
        choices: {
            type: Sequelize.STRING
        },
        isAnswers: {
            type: Sequelize.BOOLEAN
        },
        type_audio: {
            type: Sequelize.INTEGER
        },
        rang: {
            type: Sequelize.INTEGER
        },
    }, { timestamps: false,});

    return reponse;
};
