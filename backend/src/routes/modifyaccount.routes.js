const express = require('express')
const router = express.Router()
const modifyaccountController= require("../controllers/modifyaccountController") // Supposons que vous avez un contrôleur pour gérer les profils
const authMiddleware = require("../middleware/authMiddleware")

// Middleware pour l'upload de fichiers
const upload = modifyaccountController.upload

// Route pour récupérer le profil d'un utilisateur
router.get("/:id", authMiddleware.verifyToken, modifyaccountController.getUserProfile)

// Route pour mettre à jour le profil d'un utilisateur
//router.put("/:email",  authMiddleware.verifyToken, upload.single("photo"), modifyaccountController.updateUserProfile)
//router.put("/", authMiddleware.verifyToken, upload.single("photo"), modifyaccountController.updateUserProfile)
router.put("/modifier/:email", authMiddleware.verifyToken, upload.single("photo"), modifyaccountController.updateUserProfile)
module.exports = router