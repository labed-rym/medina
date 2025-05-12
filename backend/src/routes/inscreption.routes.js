const multer = require("multer");
const path = require("path");
const express = require("express");
const router = express.Router();
const inscriptionController = require("../controllers/inscriptionController");

// 📂 Configuration de Multer pour gérer plusieurs fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Assure-toi que ce dossier existe
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = inscriptionController.upload; // Utilisez l'instance déjà configurée

router.post(
  "/professionnel",
  upload.fields([
    { name: "ficheEtablissement", maxCount: 1 },
    { name: "ficheAgence", maxCount: 1 }
  ]),
  inscriptionController.inscrireProfessionnel
);

router.post('/visiteur', inscriptionController.inscrireVisiteur);

module.exports = router;
