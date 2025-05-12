const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
//const upload = require('../middlewares/multerConfig'); // si tu utilises multer pour upload d'image

// Récupérer le profil utilisateur
router.get('/:id', profileController.getProfilUtilisateur);

// Mettre à jour le profil utilisateur (y compris la photo)
//router.post('/api/profil/:id/update-photo', upload.single('photo'), profileController.mettreAJourProfil);

// Récupérer les œuvres d'un utilisateur
router.get('/oeuvre/utilisateur/:id', profileController.getOeuvresUtilisateur);

module.exports = router;
