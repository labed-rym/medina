const express = require("express");
const router = express.Router();
const sectionController = require("../controllers/sectionController");
const { verifyToken } = require("../middleware/authMiddleware");

// 🔐 Toutes les routes sont protégées par auth
router.use(verifyToken);

// 📥 Récupérer toutes les sections d'une œuvre
router.get("/:documentId", sectionController.getSections);
router.get("/ancien/:documentId", sectionController.getoldSections);
// 📥 Récupérer une section spécifique d'une œuvre par nom
router.get("/:documentId/:sectionName", sectionController.getSectionByName);

// 💾 Mettre à jour le contenu d'une section
router.put("/:documentId", sectionController.updateSection);

// 🗑 Supprimer le contenu d'une section (pas la section elle-même)
router.delete("/:documentId/:sectionName", sectionController.deleteSectionContent);
// Créer une section
router.post("/:documentId", sectionController.createSection);
// 📝 Route pour sauvegarder toutes les sections d'une œuvre
//router.put("/saveall/:documentId", sectionController.updateAllSections);
router.put('/sections', sectionController.saveAllSections);

module.exports = router;