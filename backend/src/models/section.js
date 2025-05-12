const db = require('../../db'); // Import de la connexion à la base de données

class Section {
    constructor(id, utilisateur_id, titre, id_oeuvre, date_creation, contenu_text=null,contenu_html=null,contenu_text_old=null,contenu_html_old=null) {
        this.id = id;
        this.utilisateur_id = utilisateur_id;
        this.titre = titre; // 'harchitecture', 'archeologie', 'histoire', 'resources'
        this.id_oeuvre = id_oeuvre;
        this.date_creation = date_creation || new Date().toISOString().slice(0, 19).replace('T', ' ');
        this.contenu_text = contenu_text;
        this.contenu_html = contenu_html;
        this.contenu_text_old = contenu_text_old;
        this.contenu_html_old = contenu_html_old;
    }

    /*// Créer une nouvelle section
    static async creer(utilisateur_id, titre, id_oeuvre, contenu_text=null, contenu_html=null, contenu_text_old=null, contenu_html_old=null) {
        const sql = `INSERT INTO section 
                    (utilisateur_id, titre, id_oeuvre, contenu_text, contenu_html,contenu_text_old, contenu_html_old) 
                    VALUES (?, ?, ?,?,?,?,?)`;
        const [result] = await db.execute(sql, [utilisateur_id, titre, id_oeuvre, contenu_text, contenu_html,contenu_text_old,contenu_html_old]);
        return new Section(result.insertId, utilisateur_id, titre, id_oeuvre,new Date().toISOString().slice(0, 19).replace('T', ' '), contenu_text, contenu_html,contenu_text_old,contenu_html_old);
    }*/
        static async creer({
            utilisateur_id,
            titre,
            id_oeuvre,
            contenu_text = null,
            contenu_html = null,
            contenu_text_old = null,
            contenu_html_old = null
        }) {
            const sql = `INSERT INTO section 
                        (utilisateur_id, titre, id_oeuvre, contenu_text, contenu_html, contenu_text_old, contenu_html_old) 
                        VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
            const [result] = await db.execute(sql, [
                utilisateur_id,
                titre,
                id_oeuvre,
                contenu_text,
                contenu_html,
                contenu_text_old,
                contenu_html_old
            ]);
        
            return new Section(
                result.insertId,
                utilisateur_id,
                titre,
                id_oeuvre,
                new Date().toISOString().slice(0, 19).replace('T', ' '),
                contenu_text,
                contenu_html,
                contenu_text_old,
                contenu_html_old
            );
        }

    // Trouver une section par son ID
    static async trouverParId(id) {
        const sql = "SELECT * FROM section WHERE id = ?";
        const [rows] = await db.execute(sql, [id]);
        return rows[0] ? new Section(
            rows[0].id,
            rows[0].utilisateur_id,
            rows[0].titre,
            rows[0].id_oeuvre,
            rows[0].date_creation,
            rows[0].contenu_text,
            rows[0].contenu_html,
            rows[0].contenu_text_old,
            rows[0].contenu_html_old
        ) : null;
    }

    // Trouver toutes les sections d'une œuvre
    static async trouverParOeuvre(id_oeuvre) {
        console.log("id_oeuvre", id_oeuvre);
        // Vérification de l'ID de l'œuvre
        const sql = "SELECT * FROM section WHERE id_oeuvre = ? ORDER BY date_creation DESC";
        const [rows] = await db.query(sql, [id_oeuvre]); // ✅ ici c'est corrigé
        return rows.map(row => new Section(
            row.id,
            row.utilisateur_id,
            row.titre,
            row.id_oeuvre,
            row.date_creation,
            row.contenu_text,
            row.contenu_html,
            row.contenu_text_old,
            row.contenu_html_old    
        ));
    }

    // Trouver les sections par utilisateur
    static async trouverParUtilisateur(utilisateur_id) {
        const sql = `SELECT s.*, o.titre as oeuvre_titre 
                    FROM section s
                    JOIN oeuvre o ON s.id_oeuvre = o.id
                    WHERE s.utilisateur_id = ? 
                    ORDER BY s.date_creation DESC`;
        const [rows] = await db.execute(sql, [utilisateur_id]);
        return rows.map(row => ({
            ...new Section(
                row.id,
                row.utilisateur_id,
                row.titre,
                row.id_oeuvre,
                row.date_creation,
                row.contenu_text,
                row.contenu_html,
                row.contenu_text_old,
                row.contenu_html_old    
            ),
            oeuvre_titre: row.oeuvre_titre
        }));
    }

    // Mettre à jour une section
    /*async mettreAJour(nouvellesInfos) {
        const champs = Object.keys(nouvellesInfos).filter(key => key !== 'id');
        if (champs.length === 0) return;
    
        // Remplacer undefined par null dans les nouvelles informations
        const valeurs = champs.map(champ => {
            return nouvellesInfos[champ] === undefined ? null : nouvellesInfos[champ];
        });
    
        const setClause = champs.map(champ => `${champ} = ?`).join(', ');
    
        const sql = `UPDATE section SET ${setClause} WHERE id = ?`;
        await db.execute(sql, [...valeurs, this.id]);
    
        // Mettre à jour l'instance courante
        champs.forEach(champ => {
            this[champ] = nouvellesInfos[champ];
        });
        return nouvellesInfos[champ];

    }*/
        async mettreAJour(nouvellesInfos) {
            const champs = Object.keys(nouvellesInfos).filter(key => key !== 'id');
            if (champs.length === 0) return;
        
            // Vérification des valeurs pour éviter undefined
            const valeurs = champs.map(champ => {
                // Si la valeur est undefined, la remplacer par null
                if (nouvellesInfos[champ] === undefined) {
                    nouvellesInfos[champ] = null;
                }
                return nouvellesInfos[champ];
            });
        
            // Créer la clause SQL
            const setClause = champs.map(champ => `${champ} = ?`).join(', ');
            const sql = `UPDATE section SET ${setClause} WHERE id = ?`;
        
            // Exécution de la requête
            await db.execute(sql, [...valeurs, this.id]);
        
            // Mise à jour de l'instance courante
            champs.forEach(champ => {
                this[champ] = nouvellesInfos[champ];
            });
        }
        
    

    // Supprimer une section
    async supprimer() {
        const sql = "DELETE FROM section WHERE id = ?";
        await db.execute(sql, [this.id]);
    }

    // Méthode pour compter les médias dans une section
    async compterMedias() {
        const sql = "SELECT COUNT(*) as count FROM medias WHERE id_section = ?";
        const [rows] = await db.execute(sql, [this.id]);
        return rows[0].count;
    }

    // Méthode statique pour vérifier l'appartenance
    static async verifierAppartenance(section_id, utilisateur_id) {
        const sql = "SELECT 1 FROM section WHERE id = ? AND utilisateur_id = ?";
        const [rows] = await db.execute(sql, [section_id, utilisateur_id]);
        return rows.length > 0;
    }
}

module.exports = Section;