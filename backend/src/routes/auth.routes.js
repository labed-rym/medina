const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/connexion", authController.connexion);
router.post("/mot-de-passe-oublie", authController.motDePasseOublie);
router.patch("/reinitialiser-mot-de-passe/:token", authController.reinitialiserMotDePasse);
module.exports = router;
