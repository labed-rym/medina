const bcrypt = require("bcrypt");
const multer = require("multer");
const { Professionnel } = require("../models/utilisateurs");
const { Utilisateur } = require("../models/utilisateurs");
const Notification = require("../models/notifications");
const Fiche = require("../models/fiches");
const path = require("path");
const { get } = require("http");
//const photo ="backend/profile_photos";
const photoBasepath ='/backend/src/profile_photos'
const photoFemmeFilename = 'man-and-woman-empty-avatars-set-default-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-illustration-vector (1).jpg';
const photoHommeFilename = 'man-and-woman-empty-avatars-set-default-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-illustration-vector.jpg';
const photoFemme = path.join(photoBasepath, photoFemmeFilename).replace(/\\/g, "/");
const photoHomme = path.join(photoBasepath, photoHommeFilename).replace(/\\/g, "/");
// 📂 Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// 🔹 Inscription d’un professionnel
exports.inscrireProfessionnel = async (req, res) => {
  try {
    console.log("📩 Données reçues :", req.body);
    console.log("📤 Fichiers reçus :", req.files);
    console.log("📋 Type de requête :", req.get("Content-Type"));

    // 🔽 Extraction des données
    const {
      nom, prenom, dateNaissanceJour, dateNaissanceMois, dateNaissanceAnnee,
      genre, telephone, email, specialite, etablissement_origine,
      niveau_expertise, mot_de_passe, confirmezMotDePasse
    } = req.body;
    const genreNettoye = genre.trim().toLowerCase();
    const photoDefaut = (genre.toLowerCase() === 'femme') ? photoFemme : photoHomme;
    console.log("Photo par défaut sélectionnée:", photoDefaut);
    const nom_agence = req.body.nom_agence || null;
    const numero_ordre = req.body.numero_ordre || null;
    // 📂 Récupération des fichiers
    const ficheEtablissement = req.files && req.files["ficheEtablissement"] ? req.files["ficheEtablissement"][0].path : null;
    const ficheAgence = req.files && req.files["ficheAgence"] ? req.files["ficheAgence"][0].path : null;

    // 🚨 Vérification des champs obligatoires
    if (!nom || !prenom || !dateNaissanceJour || !dateNaissanceMois || !dateNaissanceAnnee ||
        !genre || !telephone || !email || !specialite || !etablissement_origine || !mot_de_passe || 
        !confirmezMotDePasse ) {
      const champsManquants = [];
      if (!nom) champsManquants.push("nom");
      if (!prenom) champsManquants.push("prenom");
      if (!dateNaissanceJour) champsManquants.push("dateNaissanceJour");
      if (!dateNaissanceMois) champsManquants.push("dateNaissanceMois");
      if (!dateNaissanceAnnee) champsManquants.push("dateNaissanceAnnee");
      if (!genre) champsManquants.push("genre");
      if (!telephone) champsManquants.push("telephone");
      if (!email) champsManquants.push("email");
      if (!specialite) champsManquants.push("specialite");
      if (!etablissement_origine) champsManquants.push("etablissement_origine");
      if (!mot_de_passe) champsManquants.push("mot_de_passe");
      if (!confirmezMotDePasse) champsManquants.push("confirmezMotDePasse");
          console.log(champsManquants);
      return res.status(400).json({
        message: "⚠️ Tous les champs obligatoires doivent être remplis !",
        champsManquants,
      });
    }

    // 🔑 Vérification des mots de passe
    if (mot_de_passe !== confirmezMotDePasse) {
      return res.status(400).json({ message: "❌ Les mots de passe ne correspondent pas !" });
    }

    // 🗓️ Formatage de la date de naissance
    const date_naissance = `${dateNaissanceAnnee}-${dateNaissanceMois.padStart(2, "0")}-${dateNaissanceJour.padStart(2, "0")}`;

    // 🔐 Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    // 🔽 Ajout du professionnel
    const professionnel = await Professionnel.ajouterProfessionnel(
      nom, prenom, date_naissance, genre, telephone, email, 
      specialite, etablissement_origine, niveau_expertise, hashedPassword, nom_agence, numero_ordre,photoDefaut
  );  
    console.log("Professionnel créé :", professionnel);

    if (!professionnel) {
      return res.status(500).json({ message: "❌ Erreur lors de l'enregistrement du professionnel." });
    }

    // 🔽 Sauvegarde des fichiers (fiches)
    await Fiche.sauvegarder(professionnel.id, ficheEtablissement, new Date());
    if (ficheAgence) {
      await Fiche.sauvegarder(professionnel.id, ficheAgence, new Date());
    }

    console.log("✅ Inscription enregistrée :", { nom, prenom, email, specialite });
    Notification.envoyerNotificationAdmin(1,nom,prenom);
    return res.status(201).json({
      message: "✅ Inscription soumise pour validation. Un administrateur vérifiera vos documents.",
    });

  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.inscrireVisiteur = async (req, res) => {
  const { nom, prenom, genre, email, mot_de_passe, confirmezMotDePasse, date_naissance } = req.body;

  // 🚨 Vérification des champs obligatoires
  if (!nom || !prenom || !genre || !email || !mot_de_passe || !confirmezMotDePasse /*|| !date_naissance*/) {
      return res.status(400).json({ erreur: "⚠️ Tous les champs sont obligatoires." });
  }

  // 🔎 Vérification du format d'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
      return res.status(400).json({ erreur: "❌ Format d'email invalide." });
  }

  // 🔑 Vérification des mots de passe
  if (mot_de_passe !== confirmezMotDePasse) {
      return res.status(400).json({ erreur: "❌ Les mots de passe ne correspondent pas." });
  }

  try {
       const photoDefaut = (genre.toLowerCase() === 'femme') ? photoFemme : photoHomme;
      console.log("Photo par défaut sélectionnée:", photoDefaut);
      // 📌 Vérifier si l'email existe déjà
      const utilisateurExistant = await Utilisateur.trouverParEmail(email);
      if (utilisateurExistant) {
          return res.status(400).json({ erreur: "⚠️ Cet email est déjà utilisé." });
      }

      // 🔐 Hasher le mot de passe
      const motDePasseHache = await bcrypt.hash(mot_de_passe, 10);

      // 📤 Insérer le visiteur avec la méthode `creerUtilisateur`
      const visiteur = await Utilisateur.creerUtilisateur(nom,genre, prenom, email, motDePasseHache, date_naissance, "visiteur", photoDefaut);

      res.status(201).json({ message: "✅ Visiteur inscrit avec succès !", visiteur });
  } catch (erreur) {
      console.error("❌ Erreur serveur :", erreur);
      res.status(500).json({ erreur: "Erreur serveur lors de l'inscription." });
  }
};
function getDefaultPhoto(genre) {
   return genre.toLowerCase() === 'femme' ? photoFemme : photoHomme;
}
exports.upload = upload;
exports.profile_photos = {
  basePath : photoBasepath,
  femme: photoFemme,
  homme: photoHomme,
  getDefaultPhoto: getDefaultPhoto
};