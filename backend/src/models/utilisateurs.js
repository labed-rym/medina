const db = require('../../db'); // Import de la connexion à la base de données

class Utilisateur {
    constructor(id, genre, nom, prenom, email, mot_de_passe, date_naissance, type) {
        this.id = id;
        this.genre = genre;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.mot_de_passe = mot_de_passe;
        this.date_naissance = date_naissance;
        this.date_inscription = new Date().toISOString().split('T')[0];
        this.type = type;  // 'admin', 'visiteur', 'professionnel'
    }

    static async trouverParEmail(email) {
        const sql = "SELECT * FROM utilisateurs WHERE email = ?";
        const [rows] = await db.execute(sql, [email]);
        return rows.length > 0 ? rows[0] : null;
    }
    static async trouverParId(id) {
        const sql = "SELECT * FROM utilisateurs WHERE utilisateur_id = ?";
        const [rows] = await db.execute(sql, [id]);
        return rows[0] || null;
        }

    static async creerUtilisateur(nom,genre, prenom, email, mot_de_passe, date_naissance, type) {
        const sql = "INSERT INTO utilisateurs (nom, genre, prenom, email, mot_de_passe, date_naissance, date_inscription, type) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)";
        const [result] = await db.execute(sql, [nom,genre, prenom, email, mot_de_passe, date_naissance, type]);
        return new Utilisateur(result.insertId,genre, nom ,prenom, email, mot_de_passe, date_naissance, type);
    }

    static async sauvegarderResetToken(email, token, expiration) {
        const sql = "UPDATE utilisateurs SET reset_token = ?, reset_expires = ? WHERE email = ?";
        await db.execute(sql, [token, expiration, email]);
    }

    static async mettreAJourMotDePasse(email, nouveau_mdp) {
        const sql = "UPDATE utilisateurs SET mot_de_passe = ? WHERE email = ?";
        await db.execute(sql, [nouveau_mdp, email]);
    }

    static async supprimerResetToken(email) {
        const sql = "UPDATE utilisateurs SET reset_token = NULL, reset_expires = NULL WHERE email = ?";
        await db.execute(sql, [email]);
    }

    static async retournerProfile(id) {
        const sql = "SELECT prenom, nom, photo,type, specialite, etablissement_origine FROM utilisateurs WHERE utilisateur_id = ?";
        const [rows] = await db.execute(sql, [id]);
        return rows[0] || null;
    }

    static async getUserOeuvres(utilisateurId) {
        try {
            const [rows] = await db.execute(
                `SELECT 
                    id, 
                    titre, 
                    description, 
                    CONCAT('/uploads/', photo) AS media, 
                    categorie, 
                    periode AS annee, 
                    wilaya
                 FROM oeuvre
                 WHERE id_createur = ?`,
                [utilisateurId]
            );

            return rows;
        } catch (error) {
            console.error('Erreur lors de la récupération des œuvres de l\'utilisateur :', error);
            throw error;
        }
    }
    static async compterUtilisateurs() {
        const [rows] = await db.execute(`
          SELECT 
            SUM(CASE WHEN type = 'visiteur' THEN 1 ELSE 0 END) AS visiteurs,
            SUM(CASE WHEN type = 'professionnel' AND specialite = 'architecte' AND statut = 'valide' THEN 1 ELSE 0 END) AS architectes,
            SUM(CASE WHEN type = 'professionnel' AND specialite = 'historien' AND statut = 'valide' THEN 1 ELSE 0 END) AS historiens,
            SUM(CASE WHEN type = 'professionnel' AND specialite = 'archeologue' AND statut = 'valide' THEN 1 ELSE 0 END) AS archeologues
          FROM utilisateurs
        `);
        return rows[0];
    }

      static async mettreAJourParEmail(email, nouvellesInfos) {
        if (!email) throw new Error("Email non fourni pour la mise à jour.");
        // Filtrer les valeurs undefined
        const infosFiltrees = Object.fromEntries(
            Object.entries(nouvellesInfos).filter(([_, value]) => value !== undefined)
        );
        
        const champs = Object.keys(infosFiltrees);
        
        if (champs.length === 0) return;
        
        const setClause = champs.map(champ => `${champ} = ?`).join(', ');
        const sql = `UPDATE utilisateurs SET ${setClause} WHERE email = ?`;
        
        // Convertir les valeurs en tableau et remplacer undefined par null
        const valeurs = champs.map(champ => infosFiltrees[champ] === undefined ? null : infosFiltrees[champ]);
        console.log("Infos mises à jour :", valeurs, "Email:", email);

        await db.execute(sql, [...valeurs, email]);
    }
static async changerPhoto(email, nouvellePhoto) {
    const sql = "UPDATE utilisateurs SET photo = ? WHERE email = ?";
    await db.execute(sql, [nouvellePhoto, email]);
}
}

class Admin extends Utilisateur {
    constructor(id, genre, nom, prenom, email, mot_de_passe, date_naissance) {
        super(id, genre, nom, prenom, email, mot_de_passe, date_naissance, 'admin');
    }

    static async validerProfessionnel(email) {
        const sql = "UPDATE utilisateurs SET statut='valide' WHERE email = ? AND type = 'professionnel'";
        const [result] = await db.execute(sql, [email]);
        return result.affectedRows > 0;
    }
    static async refuserProfessionnel(email) {
        const sql = "UPDATE utilisateurs SET statut='rejete' WHERE email = ? AND type = 'professionnel'";
        const [result] = await db.execute(sql, [email]);
        return result.affectedRows > 0;
    }
    static async afficherDemandes() {
        const sql = "SELECT * FROM utilisateurs WHERE type = 'professionnel' AND statut = 'en attente'";
        const [rows] = await db.execute(sql);
        return rows;
    }
}

class Visiteur extends Utilisateur {
    constructor(id, genre, nom, prenom, email, mot_de_passe, date_naissance) {
        super(id, genre, nom, prenom, email, mot_de_passe, date_naissance, 'visiteur');
    }

    consulterProjets() {
        console.log(`${this.nom} consulte les projets.`);
    }
}

class Professionnel extends Utilisateur {
    constructor(id, genre, nom, prenom, email, mot_de_passe, date_naissance, telephone, specialite, niveau_expertise, etablissement_origine, statut = 'en attente') {
        super(id, genre, nom, prenom, email, mot_de_passe, date_naissance, 'professionnel');
        this.specialite = specialite;
        this.niveau_expertise = niveau_expertise;
        this.telephone = telephone;
        this.etablissement_origine = etablissement_origine;
        this.statut = statut;
    }

    static async ajouterProfessionnel(nom, prenom, date_naissance, genre, telephone, email, specialite, etablissement_origine, niveau_expertise='specialiste', mot_de_passe, nom_agence, numero_ordre,photo) {
        const sql = `INSERT INTO utilisateurs 
                    (type, nom, prenom, date_naissance, genre, telephone, email, specialite, etablissement_origine, niveau_expertise, numero_ordre, nom_agence, mot_de_passe, statut,photo) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
    
        const [result] = await db.execute(sql, [
            'professionnel', nom, prenom, date_naissance, genre, telephone, email, 
            specialite, etablissement_origine, niveau_expertise, numero_ordre, nom_agence, 
            mot_de_passe, 'en attente',photo
        ]);
    
        // 🔹 Retourner l'utilisateur inséré avec son ID
        return {
            id: result.insertId,
            nom,
            prenom,
            email,
            specialite,
            niveau_expertise
        };
    }
    
    

    async creerOeuvre(id_createur, titre, description, categorie, wilaya) {
        const date_creation = new Date().toISOString().split('T')[0];
        const sql = "INSERT INTO oeuvre (titre, description, id_createur, date_creation, categorie, wilaya) VALUES (?, ?, ?, ?, ?, ?)";
        const [result] = await db.execute(sql, [titre, description, id_createur, date_creation, categorie, wilaya]);
        return result.insertId;
    }

    static async annoterProjet(idProjet, idUtilisateur, annotation) {
        const sql = "INSERT INTO annotations (idProjet, idUtilisateur, annotation) VALUES (?, ?, ?)";
        const [result] = await db.execute(sql, [idProjet, idUtilisateur, annotation]);
        return result.insertId;
    }
}

module.exports = { Utilisateur, Admin, Visiteur, Professionnel };