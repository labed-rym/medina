/*const express = require("express");
const router = express.Router();
const { rechercher } = require("../controllers/rechController");

// Modifiez pour accepter GET et POST
router.route("/oeuvres")
  .get(rechercher)
  .post(rechercher);

module.exports = router;*/

const express = require("express");
const router = express.Router();
const rechController = require("../controllers/rechController");
const authMiddleware = require('../middleware/authMiddleware');

// 🔍 Route pour rechercher des œuvres avec filtres
router.get("/oeuvres", rechController.rechercher);

module.exports = router;