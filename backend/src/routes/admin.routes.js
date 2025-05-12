const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const creerAdmin = require("../controllers/creerAdmin");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

// Middleware pour vérifier le rôle admin
const isAdmin = checkRole(['admin']); // Autorise uniquement les utilisateurs de type "admin"

// Routes protégées (nécessitent un token valide + rôle admin)
router.get("/demandes", verifyToken, isAdmin, adminController.AfficherDemandes);
router.patch("/valider/:email", verifyToken, isAdmin, adminController.validerProfessionnel);
router.patch("/refuser/:email", verifyToken, isAdmin, adminController.refuserProfessionnel);
router.get("/fiches/:id", verifyToken, isAdmin, adminController.afficherFiches);
router.post("/ajouterAdmin", verifyToken, isAdmin, adminController.ajouterAdmin);
router.get("/statistiques", verifyToken, isAdmin, adminController.getStatistics);
// Route publique (pour la création initiale du premier admin)
router.post("/creerPremierAdmin", creerAdmin.creerPremierAdmin);

module.exports = router;