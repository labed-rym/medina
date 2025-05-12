const { Professionnel, Utilisateur } = require("../models/utilisateurs");

// Récupérer le profil d'un utilisateur par ID
exports.getProfilUtilisateur = async (req, res) => {
    try {
        const utilisateur = await Utilisateur.retournerProfile(req.params.id);
        
        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.json({
            nomComplet: `${utilisateur.prenom} ${utilisateur.nom}`,
            role: 'professionnel', 
            specialite: utilisateur.specialite,
            photo: utilisateur.photo || '/default-avatar.jpg',
            etablissement: utilisateur.etablissement_origine,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Mettre à jour le profil utilisateur (y compris la photo)
exports.mettreAJourProfil = async (req, res) => {
    try {
        const { id } = req.params;
        const { prenom, nom, specialite, etablissement } = req.body;
        const photo = req.file ? req.file.filename : null;
        
        const utilisateur = await Utilisateur.updateProfile(id, {
            prenom,
            nom,
            specialite,
            etablissement,
            photo,
        });

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.json({ message: "Profil mis à jour avec succès !" });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du profil :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Récupérer les œuvres d'un utilisateur
exports.getOeuvresUtilisateur = async (req, res) => {
    try {
        const utilisateurId = req.params.id;
        const oeuvres = await Utilisateur.getUserOeuvres(utilisateurId);
        
        if (!oeuvres) {
            return res.status(404).json({ message: "Aucune œuvre trouvée pour cet utilisateur" });
        }

        res.json(oeuvres);
    } catch (error) {
        console.error("Erreur lors de la récupération des œuvres :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
