const express = require("express");
const router = express.Router();
const rechController = require("../controllers/rechController");
const authMiddleware = require('../middleware/authMiddleware');

// 🔍 Route pour rechercher des œuvres avec filtres
router.get("/oeuvres", rechController.rechercher);

module.exports = router;