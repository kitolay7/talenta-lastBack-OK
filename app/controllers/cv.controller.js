const { filterCvsWithGPT } = require('../services/cv.service');

// Route pour filtrer les CVs
exports.filterCvs = async (req, res) => {
  try {
    const { criteria, cvs } = req.body;
    const filteredCvs = await filterCvsWithGPT(criteria, cvs);
    res.json({ filteredCvs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
