const db = require('../../db');

class Annotation {
    constructor(id, oeuvre_id, utilisateur_id, texte, section, position_x, position_y, largeur, hauteur, date_creation) {
        this.id = id;
        this.oeuvre_id = oeuvre_id;
        this.utilisateur_id = utilisateur_id;
        this.texte = texte;
        this.section = section;
        this.position_x = position_x;
        this.position_y = position_y;
        this.largeur = largeur;
        this.hauteur = hauteur;
        this.date_creation = date_creation || new Date();
    }

    // Récupérer une annotation par son ID
    static async recupererParId(id) {
        const sql = `
            SELECT * FROM annotations
            WHERE id = ?
        `;
        try {
            const [rows] = await db.execute(sql, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw new Error('Erreur lors de la récupération de l\'annotation');
        }
    }

    // Récupérer les annotations par oeuvre
    static async recupererParOeuvre(oeuvreId) {
        const [rows] = await db.execute(
            'SELECT id, utilisateur_id, oeuvre_id, texte, section, position_x, position_y, largeur, hauteur, date_creation FROM annotations WHERE oeuvre_id = ? ORDER BY date_creation DESC',
            [oeuvreId]
        );
        return rows;
    }

    // Récupérer les annotations par section d'une oeuvre
    static async recupererParSection(oeuvreId, section) {
        const [rows] = await db.execute(
            'SELECT id, utilisateur_id, oeuvre_id, texte, section, position_x, position_y, largeur, hauteur, date_creation FROM annotations WHERE oeuvre_id = ? AND section = ? ORDER BY date_creation DESC',
            [oeuvreId, section]
        );
        return rows;
    }

    // Créer une nouvelle annotation
    static async ajouter(oeuvre_id, utilisateur_id, texte, section, position_x, position_y, largeur, hauteur) {
        const [result] = await db.execute(
            'INSERT INTO annotations (oeuvre_id, utilisateur_id, texte, section, position_x, position_y, largeur, hauteur) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [oeuvre_id, utilisateur_id, texte, section, position_x, position_y, largeur, hauteur]
        );
        return result.insertId;
    }

    // Mettre à jour une annotation
    static async modifier(id, texte, position_x, position_y, largeur, hauteur) {
        const sql = `
            UPDATE annotations
            SET texte = ?, position_x = ?, position_y = ?, largeur = ?, hauteur = ?
            WHERE id = ?
        `;
        try {
            const [result] = await db.execute(sql, [texte, position_x, position_y, largeur, hauteur, id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error('Erreur lors de la mise à jour de l\'annotation');
        }
    }

    // Supprimer une annotation
    static async supprimer(id) {
        const sql = "DELETE FROM annotations WHERE id = ?";
        try {
            const [result] = await db.execute(sql, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error('Erreur lors de la suppression de l\'annotation');
        }
    }
}

module.exports = Annotation;