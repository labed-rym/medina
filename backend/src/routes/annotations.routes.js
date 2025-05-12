const express = require('express');
const router = express.Router();
const annotationController = require('../controllers/annotationsController');

// Ajouter une annotation
router.post('/', annotationController.ajouterAnnotation);

// Lister les annotations d'une oeuvre
router.get('/oeuvre/:oeuvreId', annotationController.listerAnnotations);

// Lister les annotations d'une section spécifique d'une oeuvre
router.get('/oeuvre/:oeuvreId/section/:section', annotationController.listerAnnotationsParSection);

// Modifier une annotation
router.put('/:id', annotationController.modifierAnnotation);

// Supprimer une annotation
router.delete('/:id', annotationController.supprimerAnnotation);

module.exports = router;