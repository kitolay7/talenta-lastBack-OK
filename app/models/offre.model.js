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
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        archived: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        post: {
            type: Sequelize.STRING
        },
        secteur: {
            type: Sequelize.STRING
        },
        publicationDate:{
            type: Sequelize.DATE
        },
        dossier: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
    }, {
        timestamps: true,
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
