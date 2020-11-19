module.exports = (sequelize, Sequelize) => {
    const offre = sequelize.define("offres", {
        titre: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        contexte: {
            type: Sequelize.TEXT
        },
        missions: {
            type: Sequelize.TEXT
        },
        qualification: {
            type: Sequelize.TEXT
        },
        // logo: {
        //     type: Sequelize.STRING
        // },
        // video: {
        //     type: Sequelize.STRING
        // },
        messages: {
            type: Sequelize.TEXT
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
        passe: {
            type: Sequelize.STRING,
            defaultValue: '0.5'
        },
        publicationDate: {
            type: Sequelize.DATE,
            defaultValue: null
        },
        dossier: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        logoPath: {
            type: Sequelize.STRING
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
