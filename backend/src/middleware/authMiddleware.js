/*const jwt = require('jsonwebtoken');

// Middleware unique à réutiliser partout
module.exports = (req, res, next) => {
    try {
        // 1. Récupère le token du header "Authorization"
        const token = req.headers.authorization?.split(' ')[1]; // Format: "Bearer <token>"
        if (!token) return res.status(401).json({ message: "Token manquant !" });

        // 2. Vérifie le token avec votre clé secrète (stockée dans .env)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Ajoute les infos utilisateur à `req` pour les contrôleurs
        req.user = {
            utilisateur_id: decoded.utilisateur_id,
            email: decoded.email,
            type: decoded.type // 'admin', 'professionnel', 'visiteur'
        };

        // 4. Passe au prochain middleware/contrôleur
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token invalide ou expiré !" });
    }
};*/
const jwt = require("jsonwebtoken")
const { Utilisateur } = require("../models/utilisateurs")
const UtilisateurProjet = require('../models/utilisateur_projet');
// Middleware pour vérifier le token JWT
exports.verifyToken = async (req, res, next) => {
  try {
    // Récupérer le token depuis les headers
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ message: "Accès non autorisé. Token manquant." })
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded;
    console.log("Decode du token:",decoded);
    
    const utilisateurId= decoded.id ;
    //console.log("ID reçu dans trouverParId:", utilisateur);
    if (!utilisateurId) {
      return res.status(400).json({ message: "ID utilisateur manquant dans le token." });
  }
    // Vérifier si l'utilisateur existe toujours
    const utilisateur = await Utilisateur.trouverParId(utilisateurId)
    console.log("ID reçu dans trouverParId:", utilisateur.utilisateur_id);
    if (!utilisateur) {
      return res.status(401).json({ message: "Utilisateur non trouvé." })
    }

    // Ajouter l'utilisateur à la requête
    req.user = {
      id: utilisateur.utilisateur_id,
      email: utilisateur.email,
      type: utilisateur.type,
      specialite: utilisateur.specialite,
    }

    // Vérifier si l'utilisateur tente de modifier son propre profil
    if (req.params.email && req.params.email !== utilisateur.email && utilisateur.type !== "admin") {
      return res.status(403).json({ message: "Vous ne pouvez modifier que votre propre profil." })
    }

    next()
  } catch (error) {
    console.error("Erreur d'authentification:", error)

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token invalide." })
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expiré." })
    }

    res.status(500).json({ message: "Erreur lors de l'authentification.", error: error.message })
  }
}

// Middleware pour vérifier les rôles
exports.checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié." })
    }

    if (!roles.includes(req.user.type)) {
      return res.status(403).json({ message: "Accès non autorisé pour ce rôle." })
    }

    next()
  }
}
exports.verifierAccesProjet = async (req, res, next) => {
  try {
    const idProjet = parseInt(req.params.idProjet || req.body.id_projet); // récupérer l'ID du projet de l'URL ou du body
    const utilisateur = req.user;

    if (!idProjet) {
      return res.status(400).json({ message: "ID du projet manquant." });
    }

    // 1. Vérifie que l'utilisateur est de type "professionnel"
    if (utilisateur.type !== "professionnel") {
      return res.status(403).json({ message: "Accès réservé aux professionnels." });
    }

    // 2. Vérifie que l'utilisateur participe à ce projet
    const participation = await UtilisateurProjet.verifierParticipation(utilisateur.id, idProjet);

    if (!participation || !["createur", "contributeur"].includes(participation.role)) {
      return res.status(403).json({ message: "Vous devez être créateur ou contributeur de ce projet pour y accéder." });
    }
    
    // 3. Ajoute le rôle de participation à la requête si besoin plus tard
    req.participation = participation;

    next();
  } catch (error) {
    console.error("Erreur vérification accès projet :", error);
    res.status(500).json({ message: "Erreur serveur lors de la vérification d'accès au projet." });
  }
};