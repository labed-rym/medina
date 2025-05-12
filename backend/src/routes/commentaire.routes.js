const express = require('express');
const router = express.Router();
const commentaireController = require('../controllers/commentaireController');  // Importer ton contrôleur

// Ajouter un commentaire
router.post('/', commentaireController.ajouterCommentaire);

// Lister les commentaires d'une oeuvre
router.get('/oeuvre/:oeuvreId', commentaireController.listerCommentaires);

// Modifier un commentaire
router.put('/:id', commentaireController.modifierCommentaire);

// Supprimer un commentaire
router.delete('/:id', commentaireController.supprimerCommentaire);

module.exports = router;
