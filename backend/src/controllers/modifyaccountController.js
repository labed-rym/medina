/*const { Utilisateur } = require('../models/utilisateurs');
const db = require('../../db');
const { Utilisateur } = require('C:/Users/User/Desktop/2CP/S2/PROJECT/Project_lastclone/medina-app/backend/src/models/utilisateurs'); // Import spécifique de la classe
const multer = require('multer');
const path = require('path');
// Configuration de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'backend/uploads');
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + path.extname(file.originalname);
      cb(null, uniqueName);
    }
};
  });
  
  const upload = multer({ storage });
  exports.upload = upload;
  exports.mettreAJourParEmail = async (req, res) => {
    try {
      const email = req.params.email;
      const nouvellesInfos = req.body;
  
      // Ajoute la photo si elle existe dans la requête (fichier envoyé)
      if (req.file) {
        const cheminPhoto = `uploads/${req.file.filename}`;
        nouvellesInfos.photo = cheminPhoto; // Ajoute dans les nouvelles infos
        await Utilisateur.changerPhoto(email, cheminPhoto);
      }
  
      // Vérifie si l'utilisateur existe
      const utilisateur = await Utilisateur.trouverParEmail(email);
      if (!utilisateur) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      }
  
      // Met à jour les autres infos (sauf photo qui est déjà traitée)
      await Utilisateur.mettreAJourParEmail(email, nouvellesInfos);
  
      res.status(200).json({ message: 'Compte mis à jour avec succès.' });
    } catch (error) {
      console.error('Erreur détaillée :', error);
      res.status(500).json({ 
        message: 'Erreur lors de la mise à jour du compte.',
        error: error.message
      });
    }
  };
  */
  const { Utilisateur } = require("../models/utilisateurs")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //const uploadDir = "backend/profile_photos" // Changé pour utiliser le bon dossier
    const uploadDir = path.join(__dirname, '../profile_photos')
    // Créer le répertoire s'il n'existe pas
    /*if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }*/
    
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier unique avec timestamp
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`
    cb(null, uniqueName)
  },
})

// Filtre pour n'accepter que les images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Format de fichier non supporté. Utilisez JPG, PNG, GIF ou WEBP."), false)
  }
}

// Configuration de l'upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite à 5MB
  },
})

// Exporter l'upload pour l'utiliser dans les routes
exports.upload = upload
exports.profile_photoPath = path.join(__dirname, "../", "profile_photos").replace(/\\/g, "/") // Chemin absolu vers le dossier des photos de profil
// Contrôleur pour mettre à jour le profil utilisateur
exports.updateUserProfile = async (req, res) => {
  try {
   // const email = req.parmas.email;
    const email = req.params.email;
    if (!email) {
      return res.status(400).json({ message: "L'adresse email est requise pour la mise à jour." });
  }
    const nouvellesInfos = req.body ?? {};
    
    // Vérifier si l'utilisateur existe
    const utilisateur = await Utilisateur.trouverParEmail(email)
    if (!utilisateur) {
      console.log("utilisateur non trouvé !");
      return res.status(404).json({ message: "Utilisateur non trouvé." })
    }
    
    // Traiter la photo si elle existe dans la requête
    if (req.file) {
      const cheminPhoto = `backend/src/profile_photos/${req.file.filename}` // Chemin corrigé
      // Utiliser la méthode changerPhoto existante pour mettre à jour la photo
      await Utilisateur.changerPhoto(email, cheminPhoto)
      const anciennePhotoPath = path.join(__dirname, "..", utilisateur.photo)
      // Si l'utilisateur avait déjà une photo et ce n'est pas la photo par défaut, supprimer l'ancienne
      if (
        utilisateur.photo &&
        !utilisateur.photo.includes("default") &&
        !utilisateur.photo.includes("man-and-woman-empty-avatars") &&
        fs.existsSync(anciennePhotoPath)
      ) {
        fs.unlinkSync(anciennePhotoPath)
      }
    }
    
    // Filtrer les champs en fonction du type d'utilisateur
    const champsPermis = getChampsParType(utilisateur.type)
    const infosFiltrees = {}
    
    for (const champ of champsPermis) {
      if (nouvellesInfos[champ] !== undefined && champ !== 'photo') { // Exclure photo car déjà traité
        infosFiltrees[champ] = nouvellesInfos[champ] === undefined ? null : nouvellesInfos[champ];
      }
    }
    
    // Utiliser la méthode mettreAJourParEmail existante pour mettre à jour les autres informations
    if (Object.keys(infosFiltrees).length > 0) {
      await Utilisateur.mettreAJourParEmail(email, infosFiltrees)
    }
    
    // Récupérer les informations mises à jour
    const utilisateurMisAJour = await Utilisateur.trouverParEmail(email)
    
    res.status(200).json({
      message: "Profil mis à jour avec succès.",
      utilisateur: {
        nom: utilisateurMisAJour.nom,
        prenom: utilisateurMisAJour.prenom,
        email: utilisateurMisAJour.email,
        type: utilisateurMisAJour.type,
        photo: utilisateurMisAJour.photo,
      },
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error)
    res.status(500).json({
      message: "Erreur lors de la mise à jour du profil.",
      error: error.message,
    })
  }
}

// Fonction pour obtenir les champs autorisés selon le type d'utilisateur
function getChampsParType(type) {
  // Champs communs à tous les types d'utilisateurs
  const champsCommuns = ["nom", "prenom", "genre", "date_naissance", "telephone"]
  
  // Champs spécifiques par type
  switch (type) {
    case "professionnel":
      return [...champsCommuns, "specialite", "niveau_expertise", "etablissement_origine"]
    case "admin":
      return [...champsCommuns]
    case "visiteur":
      return [...champsCommuns]
    default:
      return champsCommuns
  }
}

// Contrôleur pour récupérer les informations du profil
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id
    
    // Utiliser la méthode retournerProfile existante
    const profil = await Utilisateur.retournerProfile(userId)
    
    if (!profil) {
      return res.status(404).json({ message: "Profil non trouvé." })
    }
    
    res.status(200).json(profil)
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error)
    res.status(500).json({
      message: "Erreur lors de la récupération du profil.",
      error: error.message,
    })
  }
}