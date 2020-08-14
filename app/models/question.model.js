module.exports = (sequelize, Sequelize) => {
    const question = sequelize.define("questions", {
        name: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        },
        timer: {
            type: Sequelize.STRING
        },
        point: {
            type: Sequelize.STRING
        }
    }, { timestamps: false, });

    return question;
};
