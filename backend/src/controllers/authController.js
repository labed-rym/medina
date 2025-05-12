const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Utilisateur } = require("../models/utilisateurs");
const nodemailer = require("nodemailer");

// 📩 Configurer Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    //port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.SMTP_EMAIL,  
        pass: process.env.SMTP_PASSWORD
    }
});

// 🔹 Connexion de l'utilisateur
exports.connexion = async (req, res) => {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
        return res.status(400).json({ message: "❌ Email et mot de passe requis" });
    }

    try {
        const user = await Utilisateur.trouverParEmail(email);
        if (!user) return res.status(400).json({ message: "❌ Utilisateur non trouvé" });
        const match = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        if (!match) return res.status(400).json({ message: "❌ Mot de passe incorrect" });
        console.log("Utilisateur trouvé :", user);
        const token = jwt.sign(
            { id: user.utilisateur_id , role: user.type , email: user.email , specialite: user.specialite },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "✅ Connexion réussie", token, user });

    } catch (error) {
        console.error("Erreur serveur:", error);
        res.status(500).json({ message: "❌ Erreur serveur", error: error.message });
    }
};

// 🔹 Génération du lien de réinitialisation du mot de passe
exports.motDePasseOublie = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "❌ Email requis" });

    try {
        const user = await Utilisateur.trouverParEmail(email);
        if (!user) return res.status(400).json({ message: "❌ Utilisateur non trouvé" });

        // Générer un token sécurisé aléatoire
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hacher le token avant de le sauvegarder
        const hashedToken = await bcrypt.hash(resetToken, 10);
        const expirationDate = new Date(Date.now() + (24 * 60 * 60 * 1000)); // Expiration dans 24h

        // Sauvegarde dans la base de données
        await Utilisateur.sauvegarderResetToken(email, hashedToken, expirationDate);

        // 🔗 Lien de réinitialisation
        //const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/reinitialiser-mot-de-passe/reset-password/${resetToken}?email=${email}`;
        const resetUrl = `http://localhost:5173/validation/${resetToken}?email=${email}`;

        // 📧 Email de réinitialisation
        const mailOptions = {
            from: 'MEDINA SUPPORT <${process.env.SMTP_EMAIL}>', 
            to: email,
            subject: "Réinitialisation de votre mot de passe",
            text: `Bonjour,\n\nCliquez sur ce lien pour réinitialiser votre mot de passe : ${resetUrl}\n\nCe lien est valide pendant 24 heures.`,
        };

        await transporter.sendMail(mailOptions);
        console.log("Email envoyé avec succès à :", email);

        res.json({ message: "📩 Email de réinitialisation envoyé !" });

    } catch (error) {
        console.error("Erreur serveur:", error);
        res.status(500).json({ message: "❌ Erreur serveur", error: error.message });
    }
};

// 🔹 Réinitialisation du mot de passe
exports.reinitialiserMotDePasse = async (req, res) => {
    const token = req.params.token;
    console.log("token :", token);
    const { email, nouveau_mot_de_passe } = req.body;
    console.log("email :", email);
    
    if (!email || !token || !nouveau_mot_de_passe) {
        return res.status(400).json({ message: "❌ Email, token et nouveau mot de passe requis" });
    }

    try {
        const utilisateur = await Utilisateur.trouverParEmail(email);
        if (!utilisateur) return res.status(400).json({ message: "❌ Utilisateur non trouvé" });
        console.log("utilisateur :", utilisateur.resetToken);
        const tokenValide = await bcrypt.compare(token, utilisateur.reset_token);
        if (!tokenValide) return res.status(400).json({ message: "❌ Token invalide ou expiré" });

        // Hacher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(nouveau_mot_de_passe, 10);

        // Mettre à jour le mot de passe et supprimer le token de réinitialisation
        await Utilisateur.mettreAJourMotDePasse(email, hashedPassword);
        await Utilisateur.supprimerResetToken(email);

        res.json({ message: "✅ Mot de passe mis à jour avec succès !" });
        const newU = await Utilisateur.trouverParEmail(email);
        const check = await bcrypt.compare(hashedPassword, newU.mot_de_passe);
        console.log(hashedPassword, newU.mot_de_passe, check);

    } catch (error) {
        console.error("Erreur serveur:", error);
        res.status(500).json({ message: "❌ Erreur serveur", error: error.message });
    }
};