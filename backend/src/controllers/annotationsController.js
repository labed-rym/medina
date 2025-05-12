const Annotation = require('../models/annotations');
const {Utilisateur} = require('../models/utilisateurs');

// Ajouter une annotation
exports.ajouterAnnotation = async (req, res) => {
  const { utilisateur_id, oeuvre_id, texte, section, position_x, position_y, largeur, hauteur } = req.body;

  if (!utilisateur_id || !oeuvre_id || !texte || !section) {
    return res.status(400).json({ message: "Les champs utilisateur_id, oeuvre_id, texte et section sont requis." });
  }

  try {
    const annotationId = await Annotation.ajouter(
      oeuvre_id, 
      utilisateur_id, 
      texte,
      section,
      position_x || 0,
      position_y || 0,
      largeur || 100,
      hauteur || 50
    );
    
    res.status(201).json({
      message: 'Annotation ajoutée avec succès.',
      id: annotationId
    });
  } catch (err) {
    console.error("Erreur lors de l'ajout de l'annotation :", err);
    res.status(500).json({ erreur: "Erreur lors de l'ajout de l'annotation." });
  }
};

// Lister les annotations d'une œuvre
exports.listerAnnotations = async (req, res) => {
  const oeuvreId = req.params.oeuvreId;
  
  if (!oeuvreId) {
    return res.status(400).json({ message: "L'ID de l'œuvre est requis." });
  }

  try {
    const annotations = await Annotation.recupererParOeuvre(oeuvreId);
    
    const annotationsWithUserInfo = await Promise.all(
      annotations.map(async (annotation) => {
        try {
          const user = await Utilisateur.trouverParId(annotation.utilisateur_id);
          
          return {
            id: annotation.id,
            texte: annotation.texte,
            section: annotation.section,
            position: {
              x: annotation.position_x,
              y: annotation.position_y,
              largeur: annotation.largeur,
              hauteur: annotation.hauteur
            },
            utilisateur: {
              id: user.id,
              nom: user.nom,
              prenom: user.prenom,
              email: user.email
            },
            date_creation: annotation.date_creation
          };
        } catch (error) {
          console.error(`Error fetching user ${annotation.utilisateur_id}:`, error);
          return {
            ...annotation,
            utilisateur: {
              id: annotation.utilisateur_id,
              nom: 'Utilisateur',
              prenom: 'Inconnu',
              email: 'unknown@email.com'
            }
          };
        }
      })
    );

    res.json(annotationsWithUserInfo);
  } catch (err) {
    console.error("Erreur lors de la récupération des annotations :", err);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
};

// Lister les annotations d'une section spécifique d'une œuvre
exports.listerAnnotationsParSection = async (req, res) => {
  const { oeuvreId, section } = req.params;
  
  if (!oeuvreId || !section) {
    return res.status(400).json({ message: "L'ID de l'œuvre et la section sont requis." });
  }

  try {
    const annotations = await Annotation.recupererParSection(oeuvreId, section);
    
    const annotationsWithUserInfo = await Promise.all(
      annotations.map(async (annotation) => {
        try {
          const user = await Utilisateur.trouverParId(annotation.utilisateur_id);
          
          return {
            id: annotation.id,
            texte: annotation.texte,
            section: annotation.section,
            position: {
              x: annotation.position_x,
              y: annotation.position_y,
              largeur: annotation.largeur,
              hauteur: annotation.hauteur
            },
            utilisateur: {
              id: user.id,
              nom: user.nom,
              prenom: user.prenom,
              email: user.email
            },
            date_creation: annotation.date_creation
          };
        } catch (error) {
          console.error(`Error fetching user ${annotation.utilisateur_id}:`, error);
          return {
            ...annotation,
            utilisateur: {
              id: annotation.utilisateur_id,
              nom: 'Utilisateur',
              prenom: 'Inconnu',
              email: 'unknown@email.com'
            }
          };
        }
      })
    );

    res.json(annotationsWithUserInfo);
  } catch (err) {
    console.error("Erreur lors de la récupération des annotations :", err);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
};

// Modifier une annotation
exports.modifierAnnotation = async (req, res) => {
  const annotationId = req.params.id;
  const { texte, position_x, position_y, largeur, hauteur } = req.body;

  if (!texte) {
    return res.status(400).json({ message: "Le texte de l'annotation est requis." });
  }

  try {
    const success = await Annotation.modifier(
      annotationId, 
      texte, 
      position_x || 0, 
      position_y || 0, 
      largeur || 100, 
      hauteur || 50
    );
    
    if (success) {
      res.json({ message: 'Annotation mise à jour avec succès.' });
    } else {
      res.status(404).json({ message: "Annotation non trouvée." });
    }
  } catch (err) {
    console.error("Erreur lors de la modification de l'annotation :", err);
    res.status(500).json({ erreur: "Erreur lors de la mise à jour de l'annotation." });
  }
};

// Supprimer une annotation
exports.supprimerAnnotation = async (req, res) => {
  const annotationId = req.params.id;

  if (!annotationId) {
    return res.status(400).json({ message: "L'ID de l'annotation est requis." });
  }

  try {
    const success = await Annotation.supprimer(annotationId);
    if (success) {
      res.json({ message: 'Annotation supprimée avec succès.' });
    } else {
      res.status(404).json({ message: "Annotation non trouvée." });
    }
  } catch (err) {
    console.error("Erreur lors de la suppression de l'annotation :", err);
    res.status(500).json({ erreur: "Erreur lors de la suppression de l'annotation." });
  }
};