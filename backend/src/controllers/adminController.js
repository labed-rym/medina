const { Admin , Utilisateur} = require("../models/utilisateurs");
const Fiche   = require("../models/fiches");
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    //port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.SMTP_EMAIL,  
        pass: process.env.SMTP_PASSWORD
    }
});
exports.AfficherDemandes = async (req, res) => {
    try {
        const demandes = await Admin.afficherDemandes();
        if (demandes.length === 0) {
            return res.status(404).json({ message: "Aucune demande trouvée" });
        }
        res.status(200).json(demandes);
        console.log("Demandes trouvées :", demandes);
    } catch (error) {
        console.error("Erreur lors de l'affichage des demandes :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

exports.validerProfessionnel = async (req, res) => {
    const { email } = req.params;
    try {
        const utilisateur = await Utilisateur.trouverParEmail(email);
        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        
        const estValide = await Admin.validerProfessionnel(email);
        if (!estValide) {
            return res.status(500).json({ message: "Erreur lors de la validation" });
        }

        // 📧 Envoi de l'email de confirmation
        const mailOptions = {
            from: 'MEDINA SUPPORT <${process.env.SMTP_EMAIL}>', 
            to: email,
            subject: "Votre compte professionnel a été validé",
            text: `Bonjour,\n\nNous avons le plaisir de vous informer que votre compte professionnel a été validé avec succès.\n\nVous pouvez désormais accéder à toutes les fonctionnalités de notre plateforme.\n\nCordialement,\nL'équipe MEDINA`,
            html: `<p>Bonjour,</p>
                   <p>Nous avons le plaisir de vous informer que votre compte professionnel a été validé avec succès.</p>
                   <p>Vous pouvez désormais accéder à toutes les fonctionnalités de notre plateforme.</p>
                   <p>Cordialement,<br>L'équipe MEDINA</p>`
        };

        await transporter.sendMail(mailOptions);
        console.log("Email de confirmation envoyé avec succès à :", email);

        res.status(200).json({ message: "Utilisateur validé avec succès et notification envoyée" });
    } catch (error) {
        console.error("Erreur lors de la validation :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

exports.refuserProfessionnel = async (req, res) => {
    const { email } = req.params;
    try {
        const utilisateur = await Utilisateur.trouverParEmail(email);
        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        const estValide = await Admin.refuserProfessionnel(email);
        if (!estValide) {
            return res.status(500).json({ message: "Erreur lors de la validation" });
        }
        res.status(200).json({ message: "Utilisateur refusé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la validation :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}
exports.afficherFiches = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("ID de l'utilisateur :", id);
        const fiches = await Fiche.trouverParUtilisateurId(id);
        console.log("Fiches trouvées :", fiches);
        if (!fiches) {
            return res.status(404).json({ message: "Aucune fiche trouvée pour cet utilisateur" });
        }
        res.status(200).json(fiches);
    } catch (error) {
        console.error("Erreur lors de l'affichage des fiches :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}
exports.ajouterAdmin = async (req, res) => {
    const { nom, prenom, date_naissance, genre, email, mot_de_passe, } = req.body;
    try {
        const utilisateur = await Utilisateur.trouverParEmail(email);
        if (utilisateur) {
            return res.status(409).json({ message: "Cet email est déjà utilisé" });
        }
        const admin = await Utilisateur.creerUtilisateur(nom,genre, prenom, email, mot_de_passe, date_naissance,'admin');
        res.status(201).json(admin);
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'admin :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }

}
exports.getStatistics = async (req, res) => {
    try {
      const stats = await Utilisateur.compterUtilisateurs();
      res.status(200).json(stats);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };