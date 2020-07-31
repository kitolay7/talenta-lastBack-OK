module.exports = (sequelize, Sequelize) => {
    const question = sequelize.define("questions", {
        name: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        },
    });

    return question;
};
