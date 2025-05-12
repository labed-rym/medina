const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { verifyToken } = require('../middleware/authMiddleware');

// Routes publiques
router.get('/non-lues/:id', notificationController.NotificationNonLus);

// Routes protégées par authentification

// Marquer toutes les notifications comme lues
router.put('/marquer-lues/:id', notificationController.marquerCommeLues);

// Marquer une notification spécifique comme lue
router.put('/marquer-lue/:id', notificationController.marquerCommeLue);

// Obtenir les détails d'une notification
router.get('/:id', notificationController.obtenirNotification);

// Accepter une modification
router.put('/accepter/:id', notificationController.accepterModification);

// Refuser une modification
router.put('/refuser/:id', notificationController.refuserModification);

// Supprimer toutes les notifications d'un utilisateur
router.delete('/supprimer/:id', notificationController.supprimerToutes);

// Créer une notification
router.post('/creer', notificationController.creerNotification);

router.get('/tous/:id', notificationController.obtenirNotificationsUtilisateur);
router.get('/tous/:id', notificationController.obtenirNotificationsUtilisateur);
// ➡️ Route pour inviter un collaborateur
router.post("/inviter", verifyToken, notificationController.inviterCollaborateur);

// ➡️ Route pour accepter une invitation
router.post("/accepter", verifyToken,notificationController.accepterInvitation);
//Route pour refuser une invitation 
router.post("/refuser", verifyToken, notificationController.refuserInvitation);

module.exports = router;