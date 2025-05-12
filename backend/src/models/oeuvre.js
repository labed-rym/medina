const db = require('../../db'); // Import de la connexion à la base de données

class Oeuvre {
    
    constructor(titre,descreption,id_createur,categorie,wilaya,photo=null,periode=null,statut='brouillon',date_creation=new Date().toISOString().split('T')[0],date_modif=null,date_pub=null) {
        this.titre = titre;
        this.description = descreption;
        this.date_creation = new Date().toISOString().split('T')[0];
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
        const query = "INSERT INTO oeuvre (titre, description, date_creation, id_createur, categorie, wilaya,photo, periode, statut, date_pub, date_modif) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
            console.log("✅ Œuvre créée avec succès :", { id: result.insertId, ...nouvelleOeuvre });
            return { id: result.insertId, ...nouvelleOeuvre };
        } catch (err) {
            console.error("❌ Erreur lors de la création de l'œuvre :", err);
            throw err;
        }
    }

    static trouverParId(id, resultat) {
        const query = "SELECT * FROM oeuvre WHERE id = ?";
        db.query(query, [id], function(err, res) {
            if (err) {
                console.log("erreur: ", err);
                resultat(err, null);
                return;
            }

            if (res.length) {
                console.log("oeuvre trouvée: ", res[0]);
                resultat(null, res[0]);
                return;
            }

            resultat({ kind: "non_trouve" }, null);
        });
    }

    static obtenirTous(resultat) {
        const query = "SELECT * FROM oeuvre";
        db.query(query, function(err, res) {
            if (err) {
                console.log("erreur: ", err);
                resultat(null, err);
                return;
            }

            console.log("oeuvres: ", res);
            resultat(null, res);
        });
    }

    /*static mettreAJourParId(id, oeuvre, resultat) {
        const query = "UPDATE oeuvre SET titre = ?, description = ?, date_creation = ?, id_createur = ?, categorie = ?, wilaya = ? WHERE id = ?";
        const values = [oeuvre.titre, oeuvre.description, oeuvre.date_creation, oeuvre.id_createur, oeuvre.categorie, oeuvre.wilaya, id];
        db.query(query, values, function(err, res) {
            if (err) {
                console.log("erreur: ", err);
                resultat(err, null);
                return;
            }

            if (res.affectedRows == 0) {
                resultat({ message: "Oeuvre non trouvée" }, null);
                return;
            }

            console.log("oeuvre mise à jour: ", { id: id, ...oeuvre });
            resultat(null, { id: id, ...oeuvre });
        });
    }*/
        static async mettreAJourParId(id, updatedFields) {
            const fieldsToUpdate = {
                date_modif: new Date().toISOString().split('T')[0],
                ...updatedFields
            };
    
            if (updatedFields.statut === 'publie') {
                fieldsToUpdate.date_pub = new Date().toISOString().split('T')[0];
            }
    
            const setClauses = [];
            const values = [];
            
            for (const [key, value] of Object.entries(fieldsToUpdate)) {
                if (value !== undefined) {
                    setClauses.push(`${key} = ?`);
                    values.push(value);
                }
            }
            
            values.push(id);
    
            const query = `
                UPDATE oeuvre 
                SET ${setClauses.join(', ')}
                WHERE id = ?
            `;
    
            try {
                const [result] = await db.execute(query, values);
                if (result.affectedRows === 0) {
                    throw new Error("Œuvre non trouvée");
                }
                return await Oeuvre.getById(id);
            } catch (err) {
                console.error("Erreur mise à jour œuvre:", err);
                throw err;
            }
        }
        static async getById(id) {
            const query = `SELECT * FROM oeuvre WHERE id = ?`;
            try {
                const [rows] = await db.execute(query, [id]);
                return rows[0] || null;
            } catch (err) {
                console.error("Erreur récupération œuvre:", err);
                throw err;
            }
        }

    /*static supprimerParId(id, resultat) {
        const query = "DELETE FROM oeuvre WHERE id = ?";
        db.query(query, [id], function(err, res) {
            if (err) {
                console.log("erreur: ", err);
                resultat(err, null);
                return;
            }

            if (res.affectedRows == 0) {
                resultat({ message: "Oeuvre non trouvée" }, null);
                return;
            }

            console.log("oeuvre supprimée avec id: ", id);
            resultat(null, res);
        });
    }*/
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
        //creation des sections pour une oeuvre
        static async creerSectionsParDefaut(id_oeuvre, id_utilisateur) {
            const sections = ['architecture', 'archeologie', 'histoire', 'resources'];
            const query = `
                INSERT INTO section 
                (utilisateur_id, titre, contenu_text, id_oeuvre) 
                VALUES (?, ?, ?, ?)
            `; // Changé content_text → contenu_text
            
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
        //supression des sections d'un oeuvre
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

    static supprimerTous(resultat) {
        const query = "DELETE FROM oeuvre";
        db.query(query, function(err, res) {
            if (err) {
                console.log("erreur: ", err);
                resultat(err, null);
                return;
            }

            console.log(`supprimées ${res.affectedRows} oeuvres`);
            resultat(null, res);
        });
    }
    static async rechercherOeuvres(filtres) {
        console.log("🔍 Recherche d'œuvres avec filtres :", filtres);
    let requete = `SELECT * FROM oeuvre WHERE 1=1`; // Requête de base
    let valeurs = [];

    if (filtres.motCle) {
        requete += ` AND (titre LIKE ? OR description LIKE ?)`;
        valeurs.push(`%${filtres.motCle}%`, `%${filtres.motCle}%`);
    }
    if (filtres.categorie) {
        requete += ` AND categorie = ?`;
        valeurs.push(filtres.categorie);
    }
    if (filtres.wilaya) {
        requete += ` AND wilaya = ?`;
        valeurs.push(filtres.wilaya);
    }
    console.log("📝 Requête SQL générée :", requete, "avec valeurs :", valeurs);

    try {
        const [resultats] = await db.execute(requete, valeurs);
        if (!resultats.length) {
            return [];
        }else{
            console.log("🔍 Résultats trouvés :", resultats);
            return resultats;
        }
    } catch (erreur) {
        throw erreur;
    }
}
    
}

module.exports = Oeuvre;