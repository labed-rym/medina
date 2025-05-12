/*const express = require("express");
const router = express.Router();
const oeuvreController = require("../controllers/oeuvreController");
const authMiddleware = require('../middleware/authMiddleware');

// 📌 Créer une œuvre
router.post("/", oeuvreController.creerOeuvre);

// 📌 Supprimer une œuvre
router.delete("/:id", oeuvreController.supprimerOeuvre);


// 📌 Obtenir toutes les œuvres
router.get("/", oeuvreController.obtenirToutesLesOeuvres);

// 📌 Obtenir une œuvre par ID
router.get("/:id", oeuvreController.obtenirOeuvreParId);

// 📌 Mettre à jour une œuvre
router.put("/:id", oeuvreController.mettreAJourOeuvre);

module.exports = router;*/
const express = require('express');
const router = express.Router();
const oeuvreController = require('../controllers/oeuvreController');
const multer = require('multer');
const path = require('path');

// Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Routes des œuvres
router.post('/', upload.single('photo'), oeuvreController.creerOeuvre);
router.patch('/:id', oeuvreController.modifierAutresChamps);
router.patch('/:id/image', oeuvreController.modifierImage);
router.delete('/:id', oeuvreController.supprimerOeuvre);
router.get('/donnee/:id',oeuvreController.getOeuvreById);
// Routes des sections
router.get('/:id/sections', oeuvreController.getSectionsByOeuvre);
router.put('/sections/:id', oeuvreController.updateSection);

// Routes des contributeurs
router.post('/contributeurs', oeuvreController.ajouterContributeur);
router.delete('/contributeurs', oeuvreController.supprimerContributeur);
module.exports = router;