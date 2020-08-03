module.exports = (sequelize, Sequelize) => {
    const reponse = sequelize.define("reponses", {
        reponseId: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        },
        isAnswer: {
            type: Sequelize.STRING
        },
    }, { timestamps: false,});

    return reponse;
};
