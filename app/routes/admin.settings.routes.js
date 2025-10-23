module.exports = (app) => {
  const ctrl = require("../controllers/admin.settings.controller");

  app.get("/admin/settings/quiz-mode", ctrl.getQuizMode);
  app.put("/admin/settings/quiz-mode", ctrl.setQuizMode);
};
