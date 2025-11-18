const express = require('express');
const router = express.Router();
const cvController = require('../controllers/cv.controller');

// Route pour filtrer les CVs
router.post('/filter', cvController.filterCvs);

module.exports = router;
