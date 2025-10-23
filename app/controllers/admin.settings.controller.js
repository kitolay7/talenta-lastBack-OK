const db = require("../models");
const AdminSetting = db.admin_setting;

const KEY = "quiz_mode";
const ALLOWED = new Set(["all", "av", "none"]); // 'av' = Audio & Vidéo uniquement

exports.getQuizMode = async (req, res) => {
  try {
    let row = await AdminSetting.findOne({ where: { key: KEY } });
    if (!row) {
      // valeur par défaut
      row = await AdminSetting.create({ key: KEY, value: "all" });
    }
    return res.json({ mode: row.value });
  } catch (err) {
    console.error("getQuizMode error:", err);
    return res.status(500).json({ error: "server_error" });
  }
};

exports.setQuizMode = async (req, res) => {
  try {
    // Sécurise la lecture du body
    const raw = req?.body?.mode ?? req?.query?.mode ?? '';
    const mode = typeof raw === 'string' ? raw.toLowerCase() : '';

    const ALLOWED = new Set(['all', 'av', 'none']);
    if (!ALLOWED.has(mode)) {
      // Log utile pour debug immédiat
      console.error('[setQuizMode] invalid or missing mode. Body reçu =', req.body);
      return res.status(400).json({ error: 'invalid_mode', allowed: Array.from(ALLOWED) });
    }

    const KEY = 'quiz_mode';
    let row = await AdminSetting.findOne({ where: { key: KEY } });
    if (!row) {
      row = await AdminSetting.create({ key: KEY, value: mode });
    } else {
      row.value = mode;
      await row.save();
    }
    return res.json({ mode: row.value });
  } catch (err) {
    console.error('[setQuizMode] error:', err);
    return res.status(500).json({ error: 'server_error' });
  }
};
