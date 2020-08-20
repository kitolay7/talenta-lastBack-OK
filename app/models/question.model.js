module.exports = (sequelize, Sequelize) => {
    const question = sequelize.define("questions", {
        enunciate: {
            type: Sequelize.STRING
        },
        // type: {
        //     type: Sequelize.STRING
        // },
        timer: {
            type: Sequelize.STRING
        }
    }, { timestamps: false, });

    return question;
};
