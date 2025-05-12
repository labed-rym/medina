const express = require("express");
const router = express.Router();
const mediasController = require("../controllers/mediasController");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

// Middleware pour l'upload
const uploadMiddleware = mediasController.upload;

// ROUTES

// Upload d'un média (requiert d'être connecté)
router.post("/upload", verifyToken,checkRole(["professionnel"]), uploadMiddleware, mediasController.uploadMedia);

// Récupérer un média
//router.get("/:id",verifyToken,checkRole(["professionnel"]), mediasController.getMediaById);
router.get("/:id", mediasController.getMediaById);
router.get("/thumb/:id",verifyToken,checkRole(["professionnel"]), mediasController.getMediaThumbById);

// Métadonnées
router.get("/:id/metadata",verifyToken,checkRole(["professionnel"]), mediasController.getMediaMetadata);

// Liste par section
router.get("/section/:sectionId",verifyToken,checkRole(["professionnel"]), mediasController.getMediasBySection);

// Médias récents
router.get("/recent",verifyToken,checkRole(["professionnel"]), mediasController.getRecentMedias);

// Rechercher
router.get("/search",verifyToken,checkRole(["professionnel"]), mediasController.searchMedias);

// Statistiques
router.get("/", verifyToken,checkRole(["professionnel"]),mediasController.getMediaStats);

// 🔐 Suppression: utilisateur ou admin
router.delete("/:id", verifyToken, checkRole(["professionnel"]),mediasController.deleteMedia);

// 🔐 Mise à jour: utilisateur ou admin
router.put("/:id", verifyToken,checkRole(["professionnel"]),mediasController.updateMediaMetadata);

router.get("/oeuvre/:oeuvreId", verifyToken, checkRole(["professionnel"]), mediasController.getMediasByOeuvre);
module.exports=router;