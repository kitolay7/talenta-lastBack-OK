module.exports = (sequelize, Sequelize) => {
    const critere = sequelize.define("criteria_point_questions", {
        wording:{
            type: Sequelize.STRING
        },
        point: {
            type: Sequelize.STRING
        },
    }, { timestamps: false, });

    return critere;
};
