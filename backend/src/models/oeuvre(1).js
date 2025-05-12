const db = require('../../db');

class Oeuvre {
    constructor(
        titre, 
        description, 
        id_createur, 
        categorie, 
        wilaya, 
        photo = null, 
        periode = null, 
        statut = 'brouillon',
        date_creation = new Date().toISOString().split('T')[0],
        date_modif = null,
        date_pub = null
    ) {
        this.titre = titre;
        this.description = description;
        this.id_createur = id_createur;
        this.categorie = categorie;
        this.wilaya = wilaya;
        this.photo = photo;
        this.periode = periode;
        this.statut = statut;
        this.date_creation = date_creation;
        this.date_modif = date_modif;
        this.date_pub = statut === 'publie' ? new Date().toISOString().split('T')[0] : date_pub;
    }

    static async creer(nouvelleOeuvre) {
        const query = `
            INSERT INTO oeuvre 
            (titre, description, date_creation, id_createur, categorie, wilaya, 
             photo, periode, statut, date_pub, date_modif) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            nouvelleOeuvre.titre,
            nouvelleOeuvre.description,
            nouvelleOeuvre.date_creation,
            nouvelleOeuvre.id_createur,
            nouvelleOeuvre.categorie,
            nouvelleOeuvre.wilaya,
            nouvelleOeuvre.photo,
            nouvelleOeuvre.periode,
            nouvelleOeuvre.statut,
            nouvelleOeuvre.date_pub,
            nouvelleOeuvre.date_modif
        ];

        try {
            const [result] = await db.execute(query, values);
            return { id: result.insertId, ...nouvelleOeuvre };
        } catch (err) {
            console.error("Erreur création œuvre:", err);
            throw err;
        }
    }
    static async rechercherOeuvres(filtres) {
        const { motCle, categorie, wilaya, periode } = filtres;
        
        // Conversion des périodes
        const periodMap = {
            '430-647': { start: 430, end: 647 },
            '647-909': { start: 647, end: 909 },
            '909-1152': { start: 909, end: 1152 },
            '1152-1516': { start: 1152, end: 1516 },
            '1516-1830': { start: 1516, end: 1830 },
            '1830-1900': { start: 1830, end: 1900 },
            '1900-1962': { start: 1900, end: 1962 },
            '1962-1970': { start: 1962, end: 1970 },
            '1970-1980': { start: 1970, end: 1980 },
            '1980-1990': { start: 1980, end: 1990 },
            '1990-2000': { start: 1990, end: 2000 },
            '2000-aujourdhui': { start: 2000, end: new Date().getFullYear() }
        };
    
        let query = `
            SELECT 
                id, 
                titre as title, 
                IFNULL(photo, '/images/placeholder.png') as imageUrl,
                categorie as category,
                wilaya,
                periode as year
            FROM oeuvre 
            WHERE statut = 'publie'
        `;
        
        const params = [];
        
        if (motCle) {
            query += ` AND (titre LIKE ? OR description LIKE ?)`;
            params.push(`%${motCle}%`, `%${motCle}%`);
        }
    
        if (categorie) {
            query += ` AND categorie = ?`;
            params.push(categorie);
        }
        
        if (wilaya) {
            query += ` AND wilaya = ?`;
            params.push(wilaya);
        }
        
        if (periode && periodMap[periode]) {
            const { start, end } = periodMap[periode];
            query += ` AND periode BETWEEN ? AND ?`;
            params.push(start, end);
        }
        
        query += ` ORDER BY date_creation DESC`;
        
        console.log('Requête SQL:', query);
        console.log('Paramètres:', params);
        
        try {
            const [rows] = await db.execute(query, params);
            return rows;
        } catch (err) {
            console.error('Erreur SQL:', err);
            throw err;
        }
    }

    static async supprimer(id) {
        const query = `DELETE FROM oeuvre WHERE id = ?`;
        try {
            const [result] = await db.execute(query, [id]);
            if (result.affectedRows === 0) {
                throw new Error("Œuvre non trouvée");
            }
        } catch (err) {
            console.error("Erreur suppression œuvre:", err);
            throw err;
        }
    }

    static async ajouterCreateurProjet(id_utilisateur, id_projet) {
        const query = `
            INSERT INTO utilisateur_projet 
            (id_utilisateur, id_projet, role) 
            VALUES (?, ?, 'createur')
            ON DUPLICATE KEY UPDATE role = 'createur'
        `;
        
        try {
            await db.execute(query, [id_utilisateur, id_projet]);
        } catch (err) {
            console.error("Erreur ajout créateur:", err);
            throw err;
        }
    }

    static async creerSectionsParDefaut(id_oeuvre, id_utilisateur) {
        const sections = ['harchitecture', 'archeologie', 'histoire', 'resources'];
        const query = `
            INSERT INTO section 
            (utilisateur_id, titre, contenu_text, id_oeuvre) 
            VALUES (?, ?, ?, ?)
        `;
        
        try {
            for (const titre of sections) {
                await db.execute(query, [
                    id_utilisateur,
                    titre,
                    '', // Texte vide par défaut
                    id_oeuvre
                ]);
            }
        } catch (err) {
            console.error("Erreur création sections:", err);
            throw err;
        }
    }

    static async supprimerSections(id_oeuvre) {
        const query = `DELETE FROM section WHERE id_oeuvre = ?`;
        try {
            await db.execute(query, [id_oeuvre]);
        } catch (err) {
            console.error("Erreur suppression sections:", err);
            throw err;
        }
    }

    static async supprimerProjetUtilisateurs(id_projet) {
        const query = `DELETE FROM utilisateur_projet WHERE id_projet = ?`;
        try {
            await db.execute(query, [id_projet]);
        } catch (err) {
            console.error("Erreur suppression contributeurs:", err);
            throw err;
        }
    }

    static async verifierDroitsModification(id_oeuvre, id_utilisateur) {
        const query = `
            SELECT role FROM utilisateur_projet 
            WHERE id_projet = ? AND id_utilisateur = ?
        `;
        try {
            const [rows] = await db.execute(query, [id_oeuvre, id_utilisateur]);
            return rows.length > 0;
        } catch (err) {
            console.error("Erreur vérification droits:", err);
            throw err;
        }
    }

    static async estCreateur(id_oeuvre, id_utilisateur) {
        if (!id_oeuvre || !id_utilisateur) {
            throw new Error("Paramètres manquants pour vérification créateur");
        }
    
        const query = `
            SELECT role FROM utilisateur_projet 
            WHERE id_projet = ? AND id_utilisateur = ? AND role = 'createur'
        `;
        
        try {
            const [rows] = await db.execute(query, [id_oeuvre, id_utilisateur]);
            return rows.length > 0;
        } catch (err) {
            console.error("Erreur vérification créateur:", err);
            throw err;
        }
    }
}

module.exports = Oeuvre;
