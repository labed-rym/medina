const db = require('../../db'); // Import de la connexion à la base de données
// Entité Notification
class Notification {
    constructor(id, utilisateur_id, emetteur_id, message, type, lu, statut, contenu_original, contenu_nouveau, reference_id, reference_type, heure_de_creation) {
        this.id = id;
        this.utilisateur_id = utilisateur_id;
        this.emetteur_id = emetteur_id;
        this.message = message;
        this.type = type;
        this.lu = lu;
        this.statut = statut;
        this.contenu_original = contenu_original;
        this.contenu_nouveau = contenu_nouveau;
        this.reference_id = reference_id;
        this.reference_type = reference_type;
        this.heure_de_creation = heure_de_creation;
    }

    // Méthode pour sauvegarder une notification dans la base de données
    static async sauvegarder({utilisateur_id,
        emetteur_id,
        message,
        type,
        lu = 0,
        statut = 'en_attente',
        contenu_original = null,
        contenu_nouveau = null,
        reference_id = null,
        reference_type = null
    }) {
        const heure_de_creation = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        const query = `INSERT INTO notifications (
            utilisateur_id, emetteur_id, message, type, lu, statut,
            contenu_original, contenu_nouveau, reference_id, reference_type, heure_de_creation
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const values = [
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
            heure_de_creation
        ];
    
        const [result] = await db.execute(query, values);
        return this.obtenirParId(result.insertId);
    }
    static async envoyerNotificationAdmin(id, nom, prenom) {
        const message = `Une nouvelle inscription a été faite par ${nom} ${prenom}`;
        return this.sauvegarder({
            utilisateur_id: 1, // ID admin
            emetteur_id: id,
            message: message,
            type: 'nouveau utilisateur',
            reference_id: id,
            reference_type: 'utilisateur'
        });
    }
    // Méthode pour marquer une notification comme lue
    static async marquerCommeLues(utilisateur_id) {
        try {
            const query = 'UPDATE notifications SET lu = 1 WHERE utilisateur_id = ? AND lu = 0';
            const [result] = await db.execute(query, [utilisateur_id]);
            return result.affectedRows; // Retourne le nombre de notifications mises à jour
        } catch (error) {
            console.error("Erreur dans marquerCommeLues:", error);
            throw error;
        }
    }

    static async marquerCommeLue(notification_id, utilisateur_id) {
        try {
            const query = 'UPDATE notifications SET lu = 1 WHERE id = ? AND utilisateur_id = ?';
            const [result] = await db.execute(query, [notification_id, utilisateur_id]);
            
            if (result.affectedRows === 0) {
                throw new Error('Notification non trouvée ou déjà lue');
            }
            
            return true;
        } catch (error) {
            console.error("Erreur dans marquerCommeLue:", error);
            throw error;
        }
    }

    // Méthode pour obtenir toutes les notifications d'un utilisateur
    static async obtenirParUtilisateurId(utilisateur_id) {
        try {
            const query = 'SELECT * FROM notifications WHERE utilisateur_id = ? ORDER BY heure_de_creation DESC';
            const [results] = await db.execute(query, [utilisateur_id]);
            return results;  // Retourne toujours un tableau (même vide)
        } catch (error) {
            console.error("Erreur dans obtenirParUtilisateurId:", error);
            throw error;  // Propage l'erreur pour la gestion au niveau supérieur
        }
    }
    static async obtenirNonLues(utilisateur_id) {
        const query = `SELECT * FROM notifications 
                     WHERE utilisateur_id = ? AND lu = 0 
                     ORDER BY heure_de_creation DESC`;
        const [results] = await db.execute(query, [utilisateur_id]);
        return results;
    }
    
    static async compterNonLues(utilisateur_id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT COUNT(*) as count FROM notifications 
                         WHERE utilisateur_id = ? AND lu = 0`;
            db.query(query, [utilisateur_id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0].count);
            });
        });
    }

    static async accepterModification(notification_id, utilisateur_id) {
        try {
            const query = 'UPDATE notifications SET statut = "accepte" WHERE id = ? AND utilisateur_id = ?';
            const [result] = await db.execute(query, [notification_id, utilisateur_id]);
            
            if (result.affectedRows === 0) {
                throw new Error('Notification non trouvée');
            }
            
            return true;
        } catch (error) {
            console.error("Erreur dans accepterModification:", error);
            throw error;
        }
    }
    
    // Méthode pour refuser une modification
    static async refuserModification(notification_id, utilisateur_id) {
        try {
            const query = 'UPDATE notifications SET statut = "refuse" WHERE id = ? AND utilisateur_id = ?';
            const [result] = await db.execute(query, [notification_id, utilisateur_id]);
            
            if (result.affectedRows === 0) {
                throw new Error('Notification non trouvée');
            }
            
            return true;
        } catch (error) {
            console.error("Erreur dans refuserModification:", error);
            throw error;
        }
    }
    
    // Méthode pour supprimer toutes les notifications d'un utilisateur
    static async supprimerToutesParUtilisateur(utilisateur_id) {
        try {
            const query = 'DELETE FROM notifications WHERE utilisateur_id = ?';
            const [result] = await db.execute(query, [utilisateur_id]);
            return result.affectedRows;
        } catch (error) {
            console.error("Erreur dans supprimerToutesParUtilisateur:", error);
            throw error;
        }
    }
    // Méthode pour obtenir les détails d'une notification
static async obtenirParId(notification_id) {
    try {
        const query = 'SELECT * FROM notifications WHERE id = ?';
        const [results] = await db.execute(query, [notification_id]);
        
        if (results.length === 0) {
            throw new Error('Notification non trouvée');
        }
        
        return results[0];
    } catch (error) {
        console.error("Erreur dans obtenirParId:", error);
        throw error;
    }
}

static async creerNotificationAcceptation(utilisateur_id, emetteur_id, reference_id=null, reference_type=null) {
    return Notification.sauvegarder({
        utilisateur_id,
        emetteur_id,
        message: "Votre demande a été acceptée",
        type: 'acceptation',
        statut: 'accepte',
        reference_id,
        reference_type
    });
}

static async creerNotificationRefus(utilisateur_id, emetteur_id, reference_id=null, reference_type=null) {
    return Notification.sauvegarder({
        utilisateur_id,
        emetteur_id,
        message: "Votre demande a été refusée",
        type: 'refus',
        statut: 'refuse',
        reference_id,
        reference_type
    });
}
static async trouverParId(id) {
    try {
        const query = 'SELECT * FROM notifications WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        return rows[0] || null;
    } catch (error) {
        console.error("Erreur dans trouverParId:", error);
        throw error;
    }
}
}

module.exports = Notification;