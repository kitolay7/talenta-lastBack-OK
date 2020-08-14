module.exports = (sequelize, Sequelize) => {
    const offre = sequelize.define("offres", {
        titre: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        contexte: {
            type: Sequelize.STRING
        },
        missions: {
            type: Sequelize.STRING
        },
        qualification: {
            type: Sequelize.STRING
        },
        // logo: {
        //     type: Sequelize.STRING
        // },
        // video: {
        //     type: Sequelize.STRING
        // },
        messages: {
            type: Sequelize.STRING
        },
        // photoAnime: {
        //     type: Sequelize.STRING
        // },
        pays: {
            type: Sequelize.STRING
        },
        publier: {
            type: Sequelize.BOOLEAN
        },
        archived: {
            type: Sequelize.BOOLEAN
        },
        post: {
            type: Sequelize.STRING
        }
    }, {
        timestamps: false,
        scopes: {
            archived: {
                where: {
                    archived: true
                }
            }
        }
    });

    return offre;
};
