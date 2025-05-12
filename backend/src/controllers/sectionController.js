// Importer les modules nécessaires
const Section = require("../models/section")
const UtilisateurProjet = require("../models/utilisateur_projet")
const { Utilisateur } = require("../models/utilisateurs")
const sanitizeHtml = require('sanitize-html');


// 🔐 Fonction pour vérifier si l'utilisateur a le droit d'éditer une section
function estAutoriséAPublier(titreSection, specialiteUtilisateur) {
  // Si c'est la section resources, tout le monde peut l'éditer
  if (titreSection === "resources") return true

  // Mapping entre les titres de section et les spécialités d'utilisateur
  const mappingSpecialites = {
    architecture: "architecte",
    archeologie: "archeologue",
    histoire: "historien",
  }
  // Vérifier si la spécialité de l'utilisateur correspond à celle requise pour la section
  const specialiteRequise = mappingSpecialites[titreSection];
  if (specialiteRequise !== specialiteUtilisateur) {
    console.warn(`Utilisateur non autorisé : spécialité requise "${specialiteRequise}", spécialité utilisateur "${specialiteUtilisateur}"`);
  }
  // Vérifier si la spécialité de l'utilisateur correspond à celle requise pour la section
  return mappingSpecialites[titreSection] === specialiteUtilisateur
}

// 📥 Récupérer toutes les sections d'une œuvre(la nouvelle version)
exports.getSections = async (req, res) => {
  const { documentId } = req.params
  try {
    const sections = await Section.trouverParOeuvre(documentId)
    // Définir l'ordre souhaité
    const ordre = ['architecture', 'histoire', 'archeologie', 'resources']
    const sectionsFiltrees = sections
    .map(sec => ({
      id: sec.id,
      titre: sec.titre,
      contenu_text: sec.contenu_text,
      contenu_html: sec.contenu_html
    }))
    .sort((a, b) => ordre.indexOf(a.titre) - ordre.indexOf(b.titre))
    res.status(200).json(sectionsFiltrees)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des sections.", error })
  }
}

// 📥 Récupérer une section spécifique par nom
exports.getSectionByName = async (req, res) => {
  const { documentId, sectionName } = req.params
  try {
    const sections = await Section.trouverParOeuvre(documentId)
    const section = sections.find((sec) => sec.titre === sectionName)
    if (!section) return res.status(404).json({ message: "Section non trouvée." })
    res.status(200).json(section)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de la section.", error })
  }
}

// 💾 Mettre à jour le contenu d'une section (avec la fonctionalite de save)
exports.updateSection = async (req, res) => {
  const { documentId } = req.params;
  const { content, htmlContent,titre } = req.body;
  const { specialite, utilisateur_id, type } = req.body; // injecté depuis middleware auth
  const sectionName=titre;
  console.log("Received body:", req.body);
  try {
    console.log("je suis entré dans la fonction updateSection");
    const sections = await Section.trouverParOeuvre(documentId);
    const section = sections.find((sec) => sec.titre === sectionName);
    // Vérification des champs reçus
    const champsRequis = ['content', 'htmlContent', 'titre'];
    const champsManquants = champsRequis.filter(champ => !req.body[champ]);

    if (champsManquants.length > 0) {
      console.log("champsManquants : ", champsManquants);
      return res.status(400).json({
      message: "Certains champs requis sont manquants.",
      champsManquants
      });
    }
    if (!section) return res.status(404).json({ message: "Section non trouvée." });

    // Vérification des données reçues
    console.log("Contenu reçu pour la mise à jour : ", { content, htmlContent });

    // Vérifier permission
    if (type !== "professionnel") {
      return res.status(403).json({ message: "Seuls les utilisateurs professionnels peuvent modifier une section." });
    }

    if (!estAutoriséAPublier(section.titre, specialite)) {
      return res.status(403).json({ message: "Vous n'avez pas les droits pour modifier cette section." });
    }

    const estAutorise = await UtilisateurProjet.estParticipantAutorisé(utilisateur_id, documentId);

    if (!estAutorise) {
      return res.status(403).json({ message: "Vous n'êtes pas contributeur ou créateur de ce projet." });
    }

    // Nettoyage sécurisé du contenu HTML
    const htmlContentClean = sanitizeHtml(htmlContent);
    console.log("HTML nettoyé : ", htmlContentClean);
    // Garantir que les valeurs ne soient pas undefined
    const updatedData = {
      contenu_text_old: section.contenu_text || null,
      contenu_html_old: section.contenu_html || null,
      contenu_text: content || null,  // Remplacer undefined par null
      contenu_html: htmlContent || null // Remplacer undefined par null
    };

    console.log("Données envoyées à mettreAJour : ", updatedData);

    // Mise à jour de la section
    await section.mettreAJour(updatedData);

    res.status(200).json({ message: "Contenu de la section mis à jour avec succès." });
  } catch (error) {
    console.error("Erreur lors de la mise à jour : ", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour.", error });
  }
};


// 🗑 Supprimer le contenu d'une section (pas la section elle-même)
exports.deleteSectionContent = async (req, res) => {
  const { documentId, sectionName } = req.params
  const {  specialite, id:utilisateur_id, type } = req.user

  try {
    const sections = await Section.trouverParOeuvre(documentId)
    const section = sections.find((sec) => sec.titre === sectionName)

    if (!section) return res.status(404).json({ message: "Section non trouvée." })

      // Vérifier que l'utilisateur est professionnel
    if (type !== "professionnel") {
      return res.status(403).json({ message: "Seuls les utilisateurs professionnels peuvent supprimer le contenu d'une section." })
    }
    if (!estAutoriséAPublier(section.titre, specialite)) {
      return res.status(403).json({ message: "Vous n'avez pas les droits pour modifier cette section." })
    }
    // Vérifier s'il est créateur ou contributeur dans ce projet
    const estAutorise = await UtilisateurProjet.estParticipantAutorisé(utilisateur_id, documentId)

    if (!estAutorise) {
      return res.status(403).json({ message: "Vous n'êtes pas contributeur ou créateur de ce projet." })
    }
    const updatedData = {
      contenu_text_old: section.contenu_text || null,
      contenu_html_old: section.contenu_html || null,
      contenu_text: null,
      contenu_html: null
    };
// Mettre à jour la section pour supprimer le contenu actuel
await section.mettreAJour(updatedData);

    res.status(200).json({ message: "Contenu de la section supprimé avec succès." })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du contenu.", error })
  }
}
// 🆕 Créer une nouvelle section pour une œuvre (pour la tester)
exports.createSection = async (req, res) => {
  const { documentId } = req.params;
  const { titre, contenu_text, contenu_html } = req.body;
  const { type, specialite, id: utilisateur_id } = req.user;
  // Vérifier que toutes les variables nécessaires sont disponibles
  if (!documentId || !titre || !contenu_text || !contenu_html) {
    console.log("Variables manquantes :", {
      documentId: documentId || "documentId manquant",
      titre: titre || "titre manquant",
      contenu_text: contenu_text || "contenu_text manquant",
      contenu_html: contenu_html || "contenu_html manquant"
    });
    return res.status(400).json({ message: "Toutes les variables nécessaires doivent être fournies." });
  }

  // Afficher les variables pour vérification
  console.log("Variables reçues :", {
    documentId,
    titre,
    contenu_text,
    contenu_html
  });
  try {
    // Vérifier que l'utilisateur est professionnel
    if (type !== "professionnel") {
      return res.status(403).json({ message: "Seuls les utilisateurs professionnels peuvent créer une section." });
    }

    // Vérifier que le titre est fourni
    if (!titre) {
      return res.status(400).json({ message: "Le titre de la section est requis." });
    }

    // Vérifier que la spécialité permet la création de cette section
    if (!estAutoriséAPublier(titre, specialite)) {
      console.log("specialite de l'utilisateur !", specialite);
      console.log("titre de la section !", titre);
      return res.status(403).json({ message: "Votre spécialité ne permet pas de créer cette section." });
    }

    // Vérifier s'il est créateur ou contributeur dans ce projet
    const estAutorise = await UtilisateurProjet.estParticipantAutorisé(utilisateur_id, documentId);

    if (!estAutorise) {
      return res.status(403).json({ message: "Vous n'êtes pas contributeur ou créateur de ce projet." });
    }

    // Vérifier si une section avec ce titre existe déjà pour cette œuvre
    const sectionsExistantes = await Section.trouverParOeuvre(documentId);
    const sectionExistante = sectionsExistantes.find((section) => section.titre === titre);
    
    if (sectionExistante) {
      return res.status(409).json({
        message: `Une section "${titre}" existe déjà pour cette œuvre. Utilisez la mise à jour pour modifier son contenu.`,
        sectionId: sectionExistante.id,
      });
    }

    // Créer une nouvelle section avec les versions de contenu
    await Section.creer({
      utilisateur_id,
      titre,
      id_oeuvre: documentId,
      contenu_text,
      contenu_html,
      contenu_text_old: null,
      contenu_html_old: null
    });

    res.status(201).json({ message: "Section créée avec succès." });
  } catch (error) {
    console.error("Erreur détaillée:", error);
    res.status(500).json({ message: "Erreur lors de la création de la section.", error });
  }
}
//sauvgarder toutes les setions a la fois
// Sauvegarder toutes les sections à la fois
exports.saveAllSections = async (req, res) => {
  const { id: utilisateur_id, type, specialite } = req.user;
  const { documentId } = req.params;
  const { sections: sectionsData } = req.body;
  if (!documentId) {
    return res.status(400).json({ error: "documentId est requis" });
  }
  try {
    // Vérifications des permissions
    if (type !== "professionnel") {
      return res.status(403).json({ 
        message: "Seuls les utilisateurs professionnels peuvent modifier des sections." 
      });
    }

    // Vérifier que documentId est bien défini
    if (!documentId) {
      return res.status(400).json({ 
        message: "L'ID du document est requis." 
      });
    }

    const estAutorise = await UtilisateurProjet.estParticipantAutorisé(utilisateur_id, documentId);
    if (!estAutorise) {
      return res.status(403).json({ 
        message: "Vous n'êtes pas contributeur ou créateur de ce projet." 
      });
    }

    if (!Array.isArray(sectionsData)) {
      return res.status(400).json({ 
        error: "Le champ 'sections' doit être un tableau." 
      });
    }

    // Récupérer toutes les sections existantes
    const sectionsExistantes = await Section.trouverParOeuvre(documentId);
    
    const updates = sectionsData.map(async (sectionData) => {
      const sectionExistante = sectionsExistantes.find(
        sec => sec.titre === sectionData.titre
      );

      if (!sectionExistante) {
        console.warn(`Section ${sectionData.titre} non trouvée`);
        return null; // On ignore les sections non trouvées
      }

      if (!estAutoriséAPublier(sectionData.titre, specialite)) {
        console.warn(`Droits insuffisants pour ${sectionData.titre}`);
        return null; // On ignore les sections non autorisées
      }

      // Convertir explicitement undefined en null
      const contenu_text = sectionData.contenu_text !== undefined ? sectionData.contenu_text : null;
      const contenu_html = sectionData.contenu_html !== undefined ? 
                          sanitizeHtml(sectionData.contenu_html || '') : 
                          null;

      const updatedData = {
        contenu_text_old: sectionExistante.contenu_text || null,
        contenu_html_old: sectionExistante.contenu_html || null,
        contenu_text: contenu_text,
        contenu_html: contenu_html
      };

      console.log(`Mise à jour section ${sectionData.titre}`, updatedData);
      return sectionExistante.mettreAJour(updatedData);
    });

    // Filtrer les updates null et exécuter les autres
    const results = await Promise.all(updates.filter(u => u !== null));

    res.status(200).json({ 
      message: "Sections mises à jour avec succès.",
      updatedCount: results.length
    });

  } catch (error) {
    console.error("Erreur détaillée:", error);
    res.status(500).json({ 
      message: "Erreur lors de la sauvegarde des sections.",
      error: error.message 
    });
  }
};
// 📤 Récupérer les anciennes versions d'une section
exports.getOldSectionContent = async (req, res) => {
  const { documentId, sectionName } = req.params
  const { id: utilisateur_id, type } = req.user

  try {
    // Vérifier que l'utilisateur est professionnel
    if (type !== "professionnel") {
      return res.status(403).json({ message: "Accès réservé aux utilisateurs professionnels." })
    }

    // Vérifier la participation au projet
    const estAutorise = await UtilisateurProjet.estParticipantAutorisé(utilisateur_id, documentId)
    if (!estAutorise) {
      return res.status(403).json({ message: "Vous n'êtes pas contributeur ou créateur de ce projet." })
    }

    // Chercher la section
    const sections = await Section.trouverParOeuvre(documentId)
    const section = sections.find(sec => sec.titre === sectionName)

    if (!section) return res.status(404).json({ message: "Section non trouvée." })

    res.status(200).json({
      titre: section.titre,
      contenu_text_old: section.contenu_text_old,
      contenu_html_old: section.contenu_html_old
    })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de la version précédente.", error })
  }
}
// 📥 Récupérer toutes les sections d'une œuvre (la version ancienne)
exports.getoldSections = async (req, res) => {
  const { documentId } = req.params
  const { id: utilisateur_id, type } = req.user
  try {
    const sections = await Section.trouverParOeuvre(documentId)
    // Définir l'ordre souhaité
    const ordre = ['architecture', 'histoire', 'archeologie', 'resources']
     // Vérifier permission
     if (type !== "professionnel") {
      return res.status(403).json({ message: "Seuls les utilisateurs professionnels peuvent modifier une section." });
    }
    const estAutorise = await UtilisateurProjet.estParticipantAutorisé(utilisateur_id, documentId);

    if (!estAutorise) {
      return res.status(403).json({ message: "Vous n'êtes pas contributeur ou créateur de ce projet." });
    }
    const sectionsFiltrees = sections
    .map(sec => ({
      id: sec.id,
      titre: sec.titre,
      contenu_text: sec.contenu_text_old,
      contenu_html: sec.contenu_html_old
    }))
    .sort((a, b) => ordre.indexOf(a.titre) - ordre.indexOf(b.titre))
    res.status(200).json(sectionsFiltrees)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des sections.", error })
  }
}