module.exports = (sequelize, Sequelize) => {
    const question = sequelize.define("questions", {
        questionId: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        },
    });

    return question;
};
