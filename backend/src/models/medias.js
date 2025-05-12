const db = require('../../db');

class Media {
    constructor(id, types_medias, chemin_media, taille, date_ajout, id_utilisateur, id_section, id_oeuvre, chemin_thumbnail) {
        this.id = id;
        this.types_medias = types_medias;
        this.chemin_media = chemin_media;
        this.taille = taille;
        this.date_ajout = date_ajout || new Date();
        this.id_utilisateur = id_utilisateur;
        this.id_section = id_section;
        this.id_oeuvre = id_oeuvre;
        this.chemin_thumbnail = chemin_thumbnail;
    }
    static async recupererParOeuvre(id_oeuvre) {
        try {
          const query = `
            SELECT * 
            FROM medias 
            WHERE id_oeuvre = ?
            ORDER BY date_ajout DESC
          `;
          
          const [rows] = await db.query(query, [id_oeuvre]);
          console.log('Médias récupérés:', rows); // Debugging line
          return rows;
        } catch (error) {
          console.error('Erreur dans recupererParOeuvre:', error);
          throw error;
        }
      }

    // Récupérer un média par son ID
    static async recupererMediaParId(id) {
        const sql = `
            SELECT * FROM medias
            WHERE id = ?
        `;
        const [rows] = await db.execute(sql, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    // Récupérer les médias par type
    static async recupererParType(type) {
        const sql = `
            SELECT * FROM medias
            WHERE types_medias = ?
            ORDER BY date_ajout DESC
        `;
        const [rows] = await db.execute(sql, [type]);
        return rows;
    }

    // Récupérer les médias par utilisateur
    static async recupererParUtilisateur(userId) {
        const sql = `
            SELECT * FROM medias
            WHERE id_utilisateur = ?
            ORDER BY date_ajout DESC
        `;
        const [rows] = await db.execute(sql, [userId]);
        return rows;
    }

    // Récupérer les médias par section
    static async recupererParSection(sectionId) {
        const sql = `
            SELECT * FROM medias
            WHERE id_section = ?
            ORDER BY date_ajout DESC
        `;
        const [rows] = await db.execute(sql, [sectionId]);
        return rows;
    }

    // Créer un nouveau média
    static async creer(types_medias, chemin_media, taille, id_utilisateur, id_oeuvre, id_section, chemin_thumbnail) {
        const sql = `
            INSERT INTO medias (types_medias, chemin_media, taille, id_utilisateur, id_oeuvre, id_section, chemin_thumbnail) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [
            types_medias,
            chemin_media,
            taille,
            id_utilisateur,
            id_oeuvre,
            id_section,
            chemin_thumbnail
        ]);
        
        return new Media(
            result.insertId,
            types_medias,
            chemin_media,
            taille,
            new Date(),
            id_utilisateur,
            id_section,
            id_oeuvre,
            chemin_thumbnail
        );
    }

    // Mettre à jour un média
    static async mettreAJour(id, types_medias, chemin_media, taille, id_utilisateur, id_section, chemin_thumbnail = null) {
        const sql = `
            UPDATE medias 
            SET types_medias = ?, chemin_media = ?, taille = ?, id_utilisateur = ?, id_section = ?, chemin_thumbnail = ?
            WHERE id = ?
        `;
        const [result] = await db.execute(sql, [
            types_medias,
            chemin_media,
            taille,
            id_utilisateur,
            id_section,
            chemin_thumbnail,
            id
        ]);
    
        return result.affectedRows > 0;
    }
    
    // Supprimer un média
    static async supprimer(id) {
        const sql = "DELETE FROM medias WHERE id = ?";
        const [result] = await db.execute(sql, [id]);
        return result.affectedRows > 0;
    }

    // Compter le nombre de médias par type
    static async compterParType() {
        const sql = "SELECT types_medias, COUNT(*) as nombre FROM medias GROUP BY types_medias";
        const [rows] = await db.execute(sql);
        return rows;
    }

    // Récupérer les médias récemment ajoutés (avec limite)
    static async recupererRecents(limite = 10) {
        const sql = `
            SELECT * FROM medias
            ORDER BY date_ajout DESC
            LIMIT ?
        `;
        const [rows] = await db.execute(sql, [limite]);
        return rows;
    }

    // Rechercher des médias par mot-clé (dans le chemin)
    static async rechercher(motCle) {
        const sql = `
            SELECT * FROM medias
            WHERE chemin_media LIKE ?
            ORDER BY date_ajout DESC
        `;
        const [rows] = await db.execute(sql, [`%${motCle}%`]);
        return rows;
    }
}

module.exports = Media;