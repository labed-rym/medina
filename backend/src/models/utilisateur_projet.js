const db = require('../../db'); // Connexion à la base de données

class UtilisateurProjet {
    constructor(id_utilisateur, id_projet, role, date_participation) {
        this.id_utilisateur = id_utilisateur;
        this.id_projet = id_projet;
        this.role = role;
        this.date_participation = date_participation || new Date();
    }

    // 🔹 Ajouter un utilisateur à un projet
    static async ajouterUtilisateurAuProjet(id_utilisateur, id_projet, role = 'contributeur') {
        const sql = `INSERT INTO utilisateur_projet (id_utilisateur, id_projet, role, date_participation)
                     VALUES (?, ?, ?, NOW())`;
        try {
            console.log("🔄 Ajout utilisateur_projet :", { id_utilisateur, id_projet, role });
            await db.execute(sql, [id_utilisateur, id_projet, role]);
            console.log("✅ Ajout dans utilisateur_projet réussi !");
        } catch (error) {
            console.error("❌ Erreur ajout utilisateur_projet :", error);
        }
    }
    

    // 🔹 Récupérer tous les projets d’un utilisateur
    static async getProjetsParUtilisateur(id_utilisateur) {
        const sql = `
            SELECT o.* 
            FROM oeuvre o
            JOIN utilisateur_projet up ON o.id = up.id_projet
            WHERE up.id_utilisateur = ?
        `;
        const [rows] = await db.execute(sql, [id_utilisateur]);
        return rows;
    }

    // 🔹 Récupérer tous les utilisateurs d’un projet
    static async getUtilisateursParProjet(id_projet) {
        const sql = `
            SELECT u.utilisateur_id, u.nom, u.prenom, u.email, up.role, up.date_participation
            FROM utilisateurs u
            JOIN utilisateur_projet up ON u.utilisateur_id = up.id_utilisateur
            WHERE up.id_projet = ?
        `;
        const [rows] = await db.execute(sql, [id_projet]);
        return rows;
    }

    // 🔹 Supprimer la participation d’un utilisateur à un projet
    static async supprimerParticipation(id_utilisateur, id_projet) {
        const sql = `DELETE FROM utilisateur_projet WHERE id_utilisateur = ? AND id_projet = ?`;
        await db.execute(sql, [id_utilisateur, id_projet]);
    }

    // 🔹 Vérifier si l'utilisateur est déjà dans le projet
    static async verifierParticipation(id_utilisateur, id_projet) {
        const sql = `SELECT * FROM utilisateur_projet WHERE id_utilisateur = ? AND id_projet = ?`;
        const [rows] = await db.execute(sql, [id_utilisateur, id_projet]);
        return rows.length > 0 ? rows[0] : null;
    }
    static async estParticipantAutorisé(id_utilisateur, id_projet) {
        const sql = `
            SELECT * FROM utilisateur_projet 
            WHERE id_utilisateur = ? AND id_projet = ? AND role IN ('createur', 'contributeur')
        `;
        const [rows] = await db.execute(sql, [id_utilisateur, id_projet]);
        return rows.length > 0; // retourne true si l'utilisateur est autorisé
    }
    static async ajouterParticipation(id_utilisateur, id_projet, role) {
        const sql = "INSERT INTO utilisateur_projet (id_utilisateur, id_projet, role, date_participation) VALUES (?, ?, ?, NOW())";
        await db.execute(sql, [id_utilisateur, id_projet, role]);
    }
    static async specialiteDejaPresente(id_projet, specialite) {
        const sql = `
            SELECT u.specialite 
            FROM utilisateur_projet up
            JOIN utilisateurs u ON u.utilisateur_id = up.id_utilisateur
            WHERE up.id_projet = ? AND u.specialite = ?
        `;
        const [rows] = await db.execute(sql, [id_projet, specialite]);
        return rows.length > 0;
    }
}

module.exports = UtilisateurProjet;