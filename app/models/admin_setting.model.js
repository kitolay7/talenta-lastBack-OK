module.exports = (sequelize, Sequelize) => {
  const AdminSetting = sequelize.define("admin_setting", {
    key: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    value: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });
  return AdminSetting;
};
