module.exports = (sequelize, Sequelize) => {
    const reponse = sequelize.define("reponses", {
        name: {
            type: Sequelize.STRING
        },
        isAnswer: {
            type: Sequelize.STRING
        },
    }, { timestamps: false,});

    return reponse;
};
