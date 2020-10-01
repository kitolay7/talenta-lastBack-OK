module.exports = (sequelize, Sequelize) => {
  const details_note = sequelize.define("details_note", {
      note: {
          type: Sequelize.INTEGER,
          defaultValue : 0
      },

  }, { timestamps: false,});

  return details_note;
};
