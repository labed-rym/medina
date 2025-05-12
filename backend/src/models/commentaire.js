const db = require('../../db');

class Commentaire {
    constructor(id, oeuvre_id, utilisateur_id, contenu, date_creation) {
        this.id = id;
        this.oeuvre_id = oeuvre_id;
        this.utilisateur_id = utilisateur_id;
        this.contenu = contenu;
        this.date_creation = date_creation || new Date();  // Utilisation de la date actuelle si non fournie
    }

    // Récupérer un commentaire par son ID
    static async recupererParId(id) {
        const sql = `
            SELECT * FROM commentaires
            WHERE id = ?
        `;
        try {
            const [rows] = await db.execute(sql, [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw new Error('Erreur lors de la récupération du commentaire');
        }
    }

    // Récupérer les commentaires par oeuvre
    static async recupererParOeuvre(oeuvreId) {
        const [rows] = await db.execute(
          'SELECT id, utilisateur_id, oeuvre_id, contenu, selection, section, position_start, position_end, date_creation FROM commentaires WHERE oeuvre_id = ? ORDER BY date_creation DESC',
          [oeuvreId]
        );
        return rows;
      }

    // Créer un nouveau commentaire
   // Créer un nouveau commentaire
   static async ajouter(oeuvre_id, utilisateur_id, contenu, selection = null, section = null, position_start = null, position_end = null) {
    const [result] = await db.execute(
      'INSERT INTO commentaires (oeuvre_id, utilisateur_id, contenu, selection, section, position_start, position_end) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [oeuvre_id, utilisateur_id, contenu, selection, section, position_start, position_end]
    );
    return result.insertId;
  }
    // Mettre à jour un commentaire
    static async modifier(id, contenu) {
        const sql = `
            UPDATE commentaires
            SET contenu = ?
            WHERE id = ?
        `;
        try {
            const [result] = await db.execute(sql, [contenu, id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error('Erreur lors de la mise à jour du commentaire');
        }
    }

    // Supprimer un commentaire
    static async supprimer(id) {
        const sql = "DELETE FROM commentaires WHERE id = ?";
        try {
            const [result] = await db.execute(sql, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error('Erreur lors de la suppression du commentaire');
        }
    }
}

module.exports = Commentaire;
