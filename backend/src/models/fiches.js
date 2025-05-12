const db = require('../../db');

class Fiche {
    constructor(id, utilisateur_id, fichier_pdf, date_soumission) {
        this.id = id;
        this.utilisateur_id = utilisateur_id;
        this.fichier_pdf = fichier_pdf;
        this.date_soumission = date_soumission;
    }

    // 🔹 Sauvegarder une nouvelle fiche
    static async sauvegarder(utilisateur_id, fichier_pdf, date_soumission) {
        console.log("📂 Fichier PDF reçu :", fichier_pdf);
        const query = 'INSERT INTO fiches (utilisateur_id, fichier_pdf, date_soumission) VALUES (?, ?, ?)';
        try {
            const [result] = await db.execute(query, [utilisateur_id, fichier_pdf, date_soumission]);
            return new Fiche(result.insertId, utilisateur_id, fichier_pdf, date_soumission);
        } catch (err) {
            console.error("Erreur lors de la sauvegarde de la fiche:", err);
            throw err;
        }
    }

    // 🔹 Mettre à jour une fiche existante
    static async mettreAJour(id, fichier_pdf, date_soumission) {
        const query = 'UPDATE fiches SET fichier_pdf = ?, date_soumission = ? WHERE id = ?';
        try {
            const [result] = await db.execute(query, [fichier_pdf, date_soumission, id]);
            return result.affectedRows > 0;
        } catch (err) {
            console.error("Erreur lors de la mise à jour de la fiche:", err);
            throw err;
        }
    }

    // 🔹 Supprimer une fiche
    static async supprimer(id) {
        const query = 'DELETE FROM fiches WHERE id = ?';
        try {
            const [result] = await db.execute(query, [id]);
            return result.affectedRows > 0;
        } catch (err) {
            console.error("Erreur lors de la suppression de la fiche:", err);
            throw err;
        }
    }

    // 🔹 Récupérer toutes les fiches
    static async recupererTout() {
        const query = 'SELECT * FROM fiches';
        try {
            const [rows] = await db.execute(query);
            return rows.map(row => new Fiche(row.id, row.utilisateur_id, row.fichier_pdf, row.date_soumission));
        } catch (err) {
            console.error("Erreur lors de la récupération des fiches:", err);
            throw err;
        }
    }

    // 🔹 Trouver une fiche par ID
    static async trouverParId(id) {
        const query = 'SELECT * FROM fiches WHERE id = ?';
        try {
            const [rows] = await db.execute(query, [id]);
            return rows.length > 0 ? new Fiche(rows[0].id, rows[0].utilisateur_id, rows[0].fichier_pdf, rows[0].date_soumission) : null;
        } catch (err) {
            console.error("Erreur lors de la recherche de la fiche:", err);
            throw err;
        }
    }
    static async trouverParUtilisateurId(id){
        const query = 'SELECT * FROM fiches WHERE utilisateur_id = ?';
        try {
            const [rows] = await db.execute(query, [id]);
            return rows.length > 0 ? rows : null;
        } catch (err) {
            console.error("Erreur lors de la recherche de la fiche:", err);
            throw err;
        }
    }
}

module.exports = Fiche;
