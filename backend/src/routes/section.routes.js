const express = require("express");
const router = express.Router();
const sectionController = require("../controllers/sectionController");
const { verifyToken } = require("../middleware/authMiddleware");

// 🔐 Toutes les routes sont protégées par auth


// 📥 Récupérer toutes les sections d'une œuvre
router.get("/:documentId", sectionController.getSections);
router.get("/ancien/:documentId",verifyToken, sectionController.getoldSections);
// 📥 Récupérer une section spécifique d'une œuvre par nom
router.get("/:documentId/:sectionName",verifyToken, sectionController.getSectionByName);

// 💾 Mettre à jour le contenu d'une section
router.put("/:documentId", verifyToken,sectionController.updateSection);

// 🗑 Supprimer le contenu d'une section (pas la section elle-même)
router.delete("/:documentId/:sectionName",verifyToken, sectionController.deleteSectionContent);
// Créer une section
router.post("/:documentId",verifyToken, sectionController.createSection);
// 📝 Route pour sauvegarder toutes les sections d'une œuvre
//router.put("/saveall/:documentId", sectionController.updateAllSections);
router.put('/sections',verifyToken,sectionController.saveAllSections);

module.exports = router;