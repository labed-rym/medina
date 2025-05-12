const { Admin , Utilisateur} = require("../models/utilisateurs");
const bcrypt=require("bcrypt");
exports.creerPremierAdmin = async (req, res) => {
    try {
        const { email, motDePasse } = req.body;
        console.log("mot de passe :", motDePasse);
        const hashPass= await bcrypt.hash(motDePasse, 10); // Hachage du mot de passe

        // Vérifier si l'email est déjà utilisé
        const utilisateurExistant = await Utilisateur.trouverParEmail(email);
        if (utilisateurExistant) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }

        // Créer le premier admin
        const nouvelAdmin = await Utilisateur.creerUtilisateur('Admin','Homme', 'premier', 'admin@exemple.com', hashPass, '1990-01-01', 'Admin');
        if (!nouvelAdmin) {
            return res.status(500).json({ message: "Erreur lors de la création de l'administrateur." });
        }

        res.status(201).json({ message: "Administrateur créé avec succès." });
    } catch (error) {
        console.error("Erreur dans creerPremierAdmin:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}