module.exports = (sequelize, Sequelize) => {
    const offre = sequelize.define("type_questions", {
        wording: {
            type: Sequelize.STRING
        },
    }, {
        timestamps: false
    });

    return offre;
};
