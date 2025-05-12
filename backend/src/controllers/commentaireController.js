const Commentaire = require('../models/commentaire');
const {Utilisateur} = require('../models/utilisateurs');
// Ajouter un commentaire
exports.ajouterCommentaire = async (req, res) => {
  const { utilisateur_id, oeuvre_id, contenu, selection, section, position } = req.body;

  if (!utilisateur_id || !oeuvre_id || !contenu) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  try {
    const commentaire = await Commentaire.ajouter(
      oeuvre_id, 
      utilisateur_id, 
      contenu,
      selection,
      section,
      position?.start,
      position?.end
    );
    
    res.status(201).json({
      message: 'Commentaire ajouté avec succès.',
      id: commentaire,
      selection,
      section,
      position
    });
  } catch (err) {
    console.error("Erreur lors de l'ajout du commentaire :", err);
    res.status(500).json({ erreur: "Erreur lors de l'ajout du commentaire." });
  }
};

// Lister les commentaires d'une œuvre
exports.listerCommentaires = async (req, res) => {
  const oeuvreId = req.params.oeuvreId;
  
  if (!oeuvreId) {
    return res.status(400).json({ message: "L'ID de l'œuvre est requis." });
  }

  try {
    const commentaires = await Commentaire.recupererParOeuvre(oeuvreId);
    
    const commentsWithEmails = await Promise.all(
      commentaires.map(async (comment) => {
        try {
          const user = await Utilisateur.trouverParId(comment.utilisateur_id);
          
          return {
            id: comment.id,
            contenu: comment.contenu,
            selection: comment.selection,
            section: comment.section,
            position: {
              start: comment.position_start,
              end: comment.position_end
            },
            utilisateur_id: user.email,
            date_creation: comment.date_creation
          };
        } catch (error) {
          console.error(`Error fetching user ${comment.utilisateur_id}:`, error);
          return {
            ...comment,
            utilisateur_id: 'unknown@email.com'
          };
        }
      })
    );

    res.json(commentsWithEmails);
  } catch (err) {
    console.error("Erreur lors de la récupération des commentaires :", err);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
};
// Modifier un commentaire
exports.modifierCommentaire = async (req, res) => {
  const commentaireId = req.params.id;
  const { contenu } = req.body;

  // Vérifier si le contenu du commentaire est fourni
  if (!contenu) {
    return res.status(400).json({ message: "Le contenu du commentaire est requis." });
  }

  try {
    // Appeler la méthode statique du modèle Commentaire pour modifier le commentaire
    const success = await Commentaire.modifier(commentaireId, contenu);
    if (success) {
      res.json({ message: 'Commentaire mis à jour avec succès.' });
    } else {
      res.status(404).json({ message: "Commentaire non trouvé." });
    }
  } catch (err) {
    res.status(500).json({ erreur: "Erreur lors de la mise à jour du commentaire." });
  }
};

// Supprimer un commentaire
exports.supprimerCommentaire = async (req, res) => {
  const commentaireId = req.params.id;

  // Vérifier si l'ID du commentaire est fourni
  if (!commentaireId) {
    return res.status(400).json({ message: "L'ID du commentaire est requis." });
  }

  try {
    // Appeler la méthode statique du modèle Commentaire pour supprimer le commentaire
    const success = await Commentaire.supprimer(commentaireId);
    if (success) {
      res.json({ message: 'Commentaire supprimé avec succès.' });
    } else {
      res.status(404).json({ message: "Commentaire non trouvé." });
    }
  } catch (err) {
    res.status(500).json({ erreur: "Erreur lors de la suppression du commentaire." });
  }
};
