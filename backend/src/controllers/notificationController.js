const Notification = require("../models/notifications");
const { Utilisateur } = require("../models/utilisateurs");
const UtilisateurProjet= require("../models/utilisateur_projet");
exports.NotificationNonLus = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ message: "ID utilisateur invalide" });
        }

        const notifications = await Notification.obtenirParUtilisateurId(id);
        const notificationsNonLues = notifications.filter(notif => notif.lu === 0);
        
        res.status(200).json({
            count: notificationsNonLues.length,
            notifications: notifications
        });

    } catch (error) {
        console.error("Erreur dans NotificationNonLus:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.marquerCommeLues = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ message: "ID utilisateur invalide" });
        }

        const count = await Notification.marquerCommeLues(id);

        res.status(200).json({
            success: true,
            message: `${count} notifications marquées comme lues`,
            count
        });

    } catch (error) {
        console.error("Erreur dans marquerCommeLues:", error);
        res.status(500).json({ 
            success: false,
            message: "Erreur serveur",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.marquerCommeLue = async (req, res) => {
    try {
        const { id } = req.params;
        const utilisateur_id = req.user.id;

        if (!id || !utilisateur_id) {
            return res.status(400).json({ 
                success: false,
                message: "IDs invalides" 
            });
        }

        await Notification.marquerCommeLue(id, utilisateur_id);

        res.status(200).json({
            success: true,
            message: "Notification marquée comme lue avec succès"
        });

    } catch (error) {
        console.error("Erreur dans marquerCommeLue:", error);
        
        const status = error.message.includes('non trouvée') ? 404 : 500;
        const response = {
            success: false,
            message: error.message
        };

        if (process.env.NODE_ENV === 'development') {
            response.error = error.stack;
        }

        res.status(status).json(response);
    }
};

exports.obtenirNotification = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ message: "ID notification invalide" });
        }

        const notification = await Notification.obtenirParId(id);
        const emetteur = await Utilisateur.trouverParId(notification.emetteur_id);
        
        res.status(200).json({
            success: true,
            notification: {
                ...notification,
                emetteur: {
                    email: emetteur.email,
                    nom: emetteur.nom,
                    prenom: emetteur.prenom
                }
            }
        });

    } catch (error) {
        console.error("Erreur dans obtenirNotification:", error);
        
        const status = error.message.includes('non trouvée') ? 404 : 500;
        res.status(status).json({ 
            success: false,
            message: error.message
        });
    }
};

exports.accepterModification = async (req, res) => {
    try {
        const { id } = req.params;
        const utilisateur_id = req.user.id;

        if (!id || !utilisateur_id) {
            return res.status(400).json({ 
                success: false,
                message: "Données incomplètes" 
            });
        }

        await Notification.accepterModification(id, utilisateur_id);
        await Notification.marquerCommeLue(id, utilisateur_id);
        
        res.status(200).json({
            success: true,
            message: "Modification acceptée avec succès"
        });

    } catch (error) {
        console.error("Erreur dans accepterModification:", error);
        
        const status = error.message.includes('non trouvée') ? 404 : 500;
        res.status(status).json({ 
            success: false,
            message: error.message
        });
    }
};

exports.refuserModification = async (req, res) => {
    try {
        const { id } = req.params;
        const utilisateur_id = req.user.id;
        
        if (!id || !utilisateur_id) {
            return res.status(400).json({ 
                success: false,
                message: "Données incomplètes" 
            });
        }

        await Notification.refuserModification(id, utilisateur_id);
        await Notification.marquerCommeLue(id, utilisateur_id);
        
        res.status(200).json({
            success: true,
            message: "Modification refusée avec succès"
        });

    } catch (error) {
        console.error("Erreur dans refuserModification:", error);
        
        const status = error.message.includes('non trouvée') ? 404 : 500;
        res.status(status).json({ 
            success: false,
            message: error.message
        });
    }
};

exports.supprimerToutes = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ message: "ID utilisateur invalide" });
        }

        const count = await Notification.supprimerToutesParUtilisateur(id);
        
        res.status(200).json({
            success: true,
            message: `${count} notifications supprimées`,
            count
        });

    } catch (error) {
        console.error("Erreur dans supprimerToutes:", error);
        res.status(500).json({ 
            success: false,
            message: "Erreur serveur",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.creerNotification = async (req, res) => {
    try {
        const { 
            utilisateur_id, 
            emetteur_id,
            message, 
            type, 
            lu = 0,
            statut = 'en_attente',
            contenu_original, 
            contenu_nouveau, 
            reference_id, 
            reference_type 
        } = req.body;
        
        if (!utilisateur_id || !message || !type || !emetteur_id) {
            return res.status(400).json({ 
                success: false,
                message: "Données incomplètes" 
            });
        }

        const notification = new Notification(
            null,
            utilisateur_id,
            emetteur_id,
            message,
            type,
            lu,
            statut,
            contenu_original,
            contenu_nouveau,
            reference_id,
            reference_type,
            new Date().toISOString().slice(0, 19).replace('T', ' ')
        );
        
        await notification.sauvegarder();

        res.status(201).json({
            success: true,
            message: "Notification créée avec succès",
            notification_id: notification.id
        });

    } catch (error) {
        console.error("Erreur dans creerNotification:", error);
        res.status(500).json({ 
            success: false,
            message: "Erreur serveur",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.obtenirNotificationsUtilisateur = async (req, res) => {
    try {
        const { id } = req.params;
    
        if (!id) {
            return res.status(400).json({ message: "ID utilisateur invalide" });
        }
    
        const notifications = await Notification.obtenirParUtilisateurId(id);
        const formatted = await Promise.all(notifications.map(async (notif) => {
            const emetteur = await Utilisateur.trouverParId(notif.emetteur_id);
            return {
                id: notif.id,
                emetteur: {
                    nom: emetteur.nom,
                    email: emetteur.email,
                    prenom: emetteur.prenom,
                    profession: emetteur.specialite || null
                },
                message: notif.message,
                type: notif.type,
                statut: notif.statut,
                modification: notif.contenu_original || '',
                nouveau: notif.contenu_nouveau || '',
                reference_id: notif.reference_id,
                reference_type: notif.reference_type,
                heure_de_creation: notif.heure_de_creation
            };
        }));
    
        res.status(200).json(formatted);
    } catch (error) {
        console.error("Erreur dans obtenirNotificationsUtilisateur:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Nouvelle méthode pour envoyer une invitation
exports.envoyerInvitation = async (req, res) => {
    try {
        const { utilisateur_id, oeuvre_id, message } = req.body;
        const emetteur_id = req.user.id;

        const notification = new Notification(
            null,
            utilisateur_id,
            emetteur_id,
            message || "Invitation à collaborer sur un projet",
            'partage',
            0,
            'en_attente',
            null,
            null,
            oeuvre_id,
            'oeuvre',
            new Date().toISOString().slice(0, 19).replace('T', ' ')
        );
        
        await notification.sauvegarder();

        res.status(201).json({
            success: true,
            message: "Invitation envoyée avec succès",
            notification
        });
    } catch (error) {
        console.error("Erreur dans envoyerInvitation:", error);
        res.status(500).json({ 
            success: false,
            message: "Erreur serveur"
        });
    }
};
// ➡️ Fonction pour inviter un collaborateur
exports.inviterCollaborateur = async (req, res) => {
    try {
        const { emailInvite, idOeuvre } = req.body;
        const utilisateurId = req.user.id; // récupéré via ton middleware auth

        if (!emailInvite || !idOeuvre) {
            return res.status(400).json({ success: false, message: "Email et ID de l'œuvre sont requis" });
        }

        const utilisateurInvite = await Utilisateur.trouverParEmail(emailInvite);

        if (!utilisateurInvite) {
            return res.status(404).json({ success: false, message: "Utilisateur invité introuvable" });
        }

        if (utilisateurInvite.type !== "professionnel") {
            return res.status(400).json({ success: false, message: "Seuls les professionnels peuvent être invités" });
        }

        if (!utilisateurInvite.utilisateur_id) {
            return res.status(500).json({ success: false, message: "ID de l'utilisateur invité introuvable" });
        }

        // Vérification spécialité déjà présente, sauf pour "resources"
        const specialite = utilisateurInvite.specialite;
        if (specialite !== "resources") {
            const dejaPresent = await UtilisateurProjet.specialiteDejaPresente(idOeuvre, specialite);
            if (dejaPresent) {
                return res.status(400).json({
                    success: false,
                    message: `Un professionnel avec la spécialité '${specialite}' est déjà associé à cette œuvre.`
                });
            }
        }

        const message = `Vous avez été invité à collaborer sur une œuvre.`;
        const type = "invitation";

        const notification = await Notification.sauvegarder({
            utilisateur_id: utilisateurInvite.utilisateur_id,
            emetteur_id: utilisateurId,
            message,
            type,
            lu: 0,
            statut: 'en_attente',
            contenu_original: null,
            contenu_nouveau: null,
            reference_id: idOeuvre,
            reference_type: "oeuvre"
        });

        return res.status(201).json({
            success: true,
            message: "Invitation envoyée avec succès",
            notification
        });

    } catch (error) {
        console.error("Erreur dans inviterCollaborateur:", error);
        return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};



// ➡️ Fonction pour accepter une invitation
exports.accepterInvitation = async (req, res) => {
    try {
        const { notificationId, idOeuvre } = req.body;
        const idInvite = req.user.id; // Récupérer l'ID de l'utilisateur connecté depuis le token
        
        if (!notificationId || !idOeuvre) {
            return res.status(400).json({ success: false, message: "Notification et ID de l'œuvre requis" });
        }

        // Vérifie s'il est déjà contributeur
        const dejaContributeur = await UtilisateurProjet.verifierParticipation(idInvite, idOeuvre);
        if (dejaContributeur) {
            return res.status(400).json({ success: false, message: "Vous êtes déjà contributeur de cette œuvre." });
        }

        // Récupérer la spécialité de l'utilisateur connecté
        const utilisateur = await Utilisateur.trouverParId(idInvite);
        if (!utilisateur) {
            return res.status(404).json({ success: false, message: "Utilisateur introuvable." });
        }

        const specialite = utilisateur.specialite;

        // Vérifier si la spécialité est déjà prise
        if (specialite !== "resources") {
            const dejaPris = await UtilisateurProjet.specialiteDejaPresente(idOeuvre, specialite);
            if (dejaPris) {
                return res.status(400).json({
                    success: false,
                    message: `Un contributeur avec la spécialité '${specialite}' est déjà associé à cette œuvre.`
                });
            }
        }

        // Accepter l'invitation
        await UtilisateurProjet.ajouterParticipation(idInvite, idOeuvre, "contributeur");
        await Notification.marquerCommeLue(notificationId, idInvite);
        await Notification.accepterModification(notificationId, idInvite);

        res.status(200).json({
            success: true,
            message: "Invitation acceptée, vous êtes maintenant contributeur."
        });

    } catch (error) {
        console.error("Erreur dans accepterInvitation:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};
//refuser une invitation :
exports.refuserInvitation = async (req, res) => {
    try {
        const { notificationId } = req.body;
        const idInvite = req.user.id;

        if (!notificationId) {
            return res.status(400).json({ success: false, message: "ID de la notification requis" });
        }

        const notification = await Notification.trouverParId(notificationId);

        if (!notification || notification.utilisateur_id !== idInvite) {
            return res.status(404).json({ success: false, message: "Notification introuvable ou non autorisée" });
        }

        if (notification.lu === 1) {
            return res.status(400).json({ success: false, message: "Invitation déjà traitée." });
        }

        await Notification.marquerCommeLue(notificationId, idInvite);
        await Notification.refuserModification(notificationId, idInvite);

        return res.status(200).json({
            success: true,
            message: "Invitation refusée avec succès."
        });

    } catch (error) {
        console.error("Erreur dans refuserInvitation:", error);
        return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};
