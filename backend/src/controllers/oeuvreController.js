/*const Oeuvre = require("../models/oeuvre");
const { Utilisateur } = require("../models/utilisateurs");

// 🔹 Créer une nouvelle œuvre
exports.creerOeuvre = async (req, res) => {
    console.log("📌 creerOeuvre appelé avec:", req.body);
    try {
        const { titre, description, id_createur, categorie, wilaya } = req.body;

        // 🚨 Vérification des champs obligatoires
        if (!titre || !categorie || !wilaya || !id_createur) {
            return res.status(400).json({ message: "⚠️ Tous les champs obligatoires doivent être remplis !" });
        }

        // 🔍 Vérifier si l'utilisateur est professionnel et validé
        const utilisateur = await Utilisateur.trouverParId(id_createur);
        
        console.log("👤 Utilisateur trouvé :", utilisateur);

        if (!utilisateur || utilisateur.type !== "professionnel") {
            return res.status(403).json({ message: "⛔ Seuls les professionnels validés peuvent créer une œuvre." });
        }

        // 📌 Création de l'œuvre
        const nouvelleOeuvre = new Oeuvre(
            titre,
            description || null,
            id_createur,
            categorie,
            wilaya
        );

        await Oeuvre.creer(nouvelleOeuvre);

        console.log("✅ Œuvre créée avec succès :", nouvelleOeuvre);
        nouvelleOeuvre.id = id_oeuvre;
        return res.status(201).json({ message: "✅ Œuvre créée avec succès !", oeuvre: nouvelleOeuvre });
    } catch (error) {
        console.error("❌ Erreur serveur :", error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
};

// 🔹 Supprimer une œuvre par ID
exports.supprimerOeuvre = (req, res) => {
    const id = req.params.id;
    console.log("🧽 supprimerOeuvre appelé avec ID:", id);

    Oeuvre.supprimerParId(id, (err, result) => {
        if (err) {
            if (err.message === "Oeuvre non trouvée") {
                return res.status(404).json({ message: "❌ Œuvre non trouvée." });
            }
            console.error("❌ Erreur lors de la suppression :", err);
            return res.status(500).json({ message: "Erreur serveur." });
        }
        return res.status(200).json({ message: "✅ Œuvre supprimée avec succès." });
    });
};

// 🔹 Obtenir toutes les œuvres
exports.obtenirToutesLesOeuvres = (req, res) => {
    Oeuvre.obtenirTous((err, data) => {
        if (err) {
            return res.status(500).json({ message: "❌ Erreur lors de la récupération des œuvres." });
        }
        return res.status(200).json(data);
    });
};

// 🔹 Obtenir une œuvre par ID
exports.obtenirOeuvreParId = (req, res) => {
    const id = req.params.id;

    Oeuvre.trouverParId(id, (err, data) => {
        if (err) {
            if (err.kind === "non_trouve") {
                return res.status(404).json({ message: "❌ Œuvre non trouvée." });
            }
            return res.status(500).json({ message: "❌ Erreur lors de la récupération de l'œuvre." });
        }
        return res.status(200).json(data);
    });
};

// 🔹 Mettre à jour une œuvre
exports.mettreAJourOeuvre = (req, res) => {
    const id = req.params.id;
    const { titre, description, id_createur, categorie, wilaya } = req.body;

    const oeuvreMiseAJour = {
        titre,
        description,
        date_creation: new Date().toISOString().split('T')[0],
        id_createur,
        categorie,
        wilaya
    };

    Oeuvre.mettreAJourParId(id, oeuvreMiseAJour, (err, data) => {
        if (err) {
            if (err.message === "Oeuvre non trouvée") {
                return res.status(404).json({ message: "❌ Œuvre non trouvée." });
            }
            return res.status(500).json({ message: "❌ Erreur lors de la mise à jour de l'œuvre." });
        }
        return res.status(200).json({ message: "✅ Œuvre mise à jour avec succès.", oeuvre: data });
    });
};*/
const fs = require('fs');
const path = require('path');
const Oeuvre = require('../models/oeuvre');

const creerOeuvre = async (req, res) => {
    try {
        const { 
            titre, 
            description, 
            categorie, 
            wilaya, 
            id_createur, 
            periode, 
            statut = 'brouillon' 
        } = req.body;
        console.log("reçu du front :",titre, 
            description, 
            categorie, 
            wilaya, 
            id_createur, 
            periode,)
        const photo = req.file ? req.file.filename : null;

        if (!titre || !categorie || !wilaya || !id_createur) {
            const champsManquants = [];
            if (!titre) champsManquants.push("titre");
            if (!description) champsManquants.push("description");
            if (!categorie) champsManquants.push("categorie");
            if (!wilaya) champsManquants.push("wilaya");
            if (!id_createur) champsManquants.push("id_createur");

            return res.status(400).json({ 
                success: false,
                message: `Les champs suivants sont manquants : ${champsManquants.join(", ")}` 
            });
            return res.status(400).json({ 
                success: false,
                message: "Tous les champs obligatoires sont requis" 
            });
        }

        const nouvelleOeuvre = new Oeuvre(
            titre, 
            description||null, 
            id_createur, 
            categorie, 
            wilaya, 
            photo, 
            periode, 
            statut
        );

        const oeuvreCreee = await Oeuvre.creer(nouvelleOeuvre);
        await Oeuvre.ajouterCreateurProjet(id_createur, oeuvreCreee.id);
        await Oeuvre.creerSectionsParDefaut(oeuvreCreee.id, id_createur);
        
        res.status(201).json({
            success: true,
            data: oeuvreCreee,
            message: "Œuvre créée avec succès"
        });
    } catch (error) {
        console.error("Erreur création:", error);
        res.status(500).json({ 
            success: false,
            message: error.message || "Erreur serveur",
            error: error.message 
        });
    }
};

const modifierAutresChamps = async (req, res) => {
    try {
        const id = req.params.id;
        const { 
            titre, 
            description, 
            categorie, 
            wilaya, 
            periode, 
            statut,
            id_utilisateur 
        } = req.body;

        const peutModifier = await Oeuvre.verifierDroitsModification(id, id_utilisateur);
        if (!peutModifier) {
            return res.status(403).json({ 
                success: false,
                message: "Action non autorisée" 
            });
        }

        const ancienneOeuvre = await Oeuvre.getById(id);
        if (!ancienneOeuvre) {
            return res.status(404).json({ 
                success: false,
                message: "Œuvre introuvable" 
            });
        }

        const updatedFields = {
            titre: titre || ancienneOeuvre.titre,
            description: description || ancienneOeuvre.description,
            categorie: categorie || ancienneOeuvre.categorie,
            wilaya: wilaya || ancienneOeuvre.wilaya,
            periode: periode || ancienneOeuvre.periode,
            statut: statut || ancienneOeuvre.statut
        };

        const oeuvreModifiee = await Oeuvre.mettreAJourParId(id, updatedFields);
        res.status(200).json({
            success: true,
            data: oeuvreModifiee
        });
    } catch (error) {
        console.error("Erreur modification:", error);
        res.status(500).json({ 
            success: false,
            message: error.message || "Erreur serveur",
            error: error.message 
        });
    }
};

const modifierImage = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.body.id_utilisateur;
        const { photo } = req.body;

        if (!photo) {
            return res.status(400).json({ message: "Le champ 'photo' est requis." });
        }

        const peutModifier = await Oeuvre.verifierDroitsModification(id, userId);
        if (!peutModifier) {
            return res.status(403).json({ message: "Vous n'avez pas les droits pour modifier cette œuvre." });
        }

        const ancienneOeuvre = await Oeuvre.getById(id);
        if (!ancienneOeuvre) {
            return res.status(404).json({ message: "Œuvre non trouvée." });
        }

        if (ancienneOeuvre.photo && ancienneOeuvre.photo !== photo) {
            const imagePath = path.join(__dirname, '../../uploads', ancienneOeuvre.photo);
            fs.unlink(imagePath, (err) => {
                if (err) console.warn("Impossible de supprimer l'ancienne image:", err.message);
            });
        }

        const updatedFields = { photo };
        const oeuvreModifiee = await Oeuvre.mettreAJourParId(id, updatedFields);

        res.status(200).json(oeuvreModifiee);
    } catch (error) {
        console.error("Erreur modification image:", error);
        res.status(500).json({
            message: "Erreur serveur",
            erreur: error.message
        });
    }
};

const supprimerOeuvre = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_utilisateur } = req.body;

        // Validation des paramètres
        if (!id_utilisateur) {
            return res.status(400).json({ 
                success: false,
                message: "id_utilisateur est requis" 
            });
        }

        const estCreateur = await Oeuvre.estCreateur(id, id_utilisateur);
        if (!estCreateur) {
            return res.status(403).json({ 
                success: false,
                message: "Seul le créateur peut supprimer l'œuvre" 
            });
        }


        const oeuvre = await Oeuvre.getById(id);
        if (!oeuvre) {
            return res.status(404).json({ 
                success: false,
                message: "Œuvre introuvable" 
            });
        }

        if (oeuvre.photo) {
            const imagePath = path.join(__dirname, '../../uploads', oeuvre.photo);
            fs.unlink(imagePath, (err) => {
                if (err) console.warn("Erreur suppression image:", err.message);
            });
        }

        await Oeuvre.supprimerSections(id);
        await Oeuvre.supprimerProjetUtilisateurs(id);
        await Oeuvre.supprimer(id);

        res.status(200).json({ 
            success: true,
            message: "Œuvre supprimée avec succès" 
        });
    } catch (error) {
        console.error("Erreur suppression:", error);
        res.status(500).json({ 
            success: false,
            message: error.message || "Erreur serveur",
            error: error.message 
        });
    }
};

const getSectionsByOeuvre = async (req, res) => {
    try {
        const id_oeuvre = req.params.id;
        const query = `SELECT * FROM section WHERE id_oeuvre = ?`;
        const [sections] = await db.execute(query, [id_oeuvre]);
        res.status(200).json({
            success: true,
            data: sections
        });
    } catch (error) {
        console.error("Erreur récupération sections:", error);
        res.status(500).json({ 
            success: false,
            message: error.message || "Erreur serveur",
            error: error.message 
        });
    }
};

const getOeuvreById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("id :",id);
        const oeuvre = await Oeuvre.getById(id);
        console.log("oeuvre :",oeuvre);
        if (!oeuvre) {
            return res.status(404).json({ 
                success: false,
                message: "Œuvre introuvable" 
            });
        }
        console.log("oeuvre :", oeuvre);
        res.status(200).json({
            success: true,
            data: oeuvre
        });
    } catch (error) {
        console.error("Erreur récupération œuvre:", error);
        res.status(500).json({ 
            success: false,
            message: error.message || "Erreur serveur",
            error: error.message 
        });
    }
};
const updateSection = async (req, res) => {
    try {
        const { id } = req.params;
        const { contenu_text } = req.body; // Changé content_text → contenu_text

        const query = `UPDATE section SET contenu_text = ? WHERE id = ?`;
        await db.execute(query, [contenu_text, id]);

        res.status(200).json({
            success: true,
            message: "Section mise à jour"
        });
    } catch (error) {
        console.error("Erreur mise à jour section:", error);
        res.status(500).json({ 
            success: false,
            message: error.message
        });
    }
};

const ajouterContributeur = async (req, res) => {
    try {
        const { id_projet, id_utilisateur, id_createur } = req.body;

        const estCreateur = await Oeuvre.estCreateur(id_projet, id_createur);
        if (!estCreateur) {
            return res.status(403).json({ 
                success: false,
                message: "Seul le créateur peut ajouter des contributeurs" 
            });
        }

        const query = `
            INSERT INTO utilisateur_projet 
            (id_utilisateur, id_projet, role) 
            VALUES (?, ?, 'contributeur')
        `;
        await db.execute(query, [id_utilisateur, id_projet]);

        res.status(200).json({
            success: true,
            message: "Contributeur ajouté"
        });
    } catch (error) {
        console.error("Erreur ajout contributeur:", error);
        res.status(500).json({ 
            success: false,
            message: error.message || "Erreur serveur",
            error: error.message 
        });
    }
};

const supprimerContributeur = async (req, res) => {
    try {
        const { id_projet, id_utilisateur, id_createur } = req.body;

        const estCreateur = await Oeuvre.estCreateur(id_projet, id_createur);
        if (!estCreateur) {
            return res.status(403).json({ 
                success: false,
                message: "Seul le créateur peut supprimer des contributeurs" 
            });
        }

        const query = `
            DELETE FROM utilisateur_projet 
            WHERE id_utilisateur = ? AND id_projet = ? AND role = 'contributeur'
        `;
        await db.execute(query, [id_utilisateur, id_projet]);

        res.status(200).json({
            success: true,
            message: "Contributeur supprimé"
        });
    } catch (error) {
        console.error("Erreur suppression contributeur:", error);
        res.status(500).json({ 
            success: false,
            message: error.message || "Erreur serveur",
            error: error.message 
        });
    }
};

module.exports = {
    creerOeuvre,
    modifierAutresChamps,
    modifierImage,
    supprimerOeuvre,
    getSectionsByOeuvre,
    updateSection,
    ajouterContributeur,
    supprimerContributeur,
    getOeuvreById
};