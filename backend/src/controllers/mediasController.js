const Media = require("../models/medias")
const fs = require("fs")
const path = require("path")
const multer = require("multer")
const ffmpeg = require("fluent-ffmpeg");

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../medias")

    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier unique
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + "-" + uniqueSuffix + ext)
  },
})

// Filtrer les types de fichiers acceptés
const fileFilter = (req, file, cb) => {
  // Accepter les images, vidéos, PDFs et documents
  const allowedTypes = ["image/jpeg", "image/png", "video/mp4"]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Type de fichier non supporté"), false)
  }
}

// Initialiser l'upload avec multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  //limits: { fileSize: 10 * 1024 * 1024 }, // Limite à 10MB
}).fields([
    { name: "file", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
  ]);

// Exporter le middleware d'upload
exports.upload = upload

// Télécharger un média
exports.uploadMedia = async (req, res) => {
  try {
    const mediaFile = req.files.file?.[0];
    const thumbnailFile = req.files.thumbnail?.[0];

    if (!mediaFile) {
      return res.status(400).json({ success: false, message: "Aucun fichier n'a été téléchargé" });
    }

    const { id_utilisateur, id_oeuvre, id_section } = req.body;

    if (!id_utilisateur || !id_oeuvre || !id_section) {
      return res.status(400).json({ success: false, message: "Identifiants requis" });
    }

    // Validate section ID is one of the enum values
    const validSections = ['architecture', 'archeologie', 'histoire', 'ressources'];
    if (!validSections.includes(id_section)) {
      return res.status(400).json({ success: false, message: "Section invalide" });
    }

    // Type de média
    let type_media;
    if (mediaFile.mimetype.startsWith("image/")) {
      type_media = "image";
    } else if (mediaFile.mimetype.startsWith("video/")) {
      type_media = "video";
    } else {
      return res.status(400).json({ success: false, message: "Type de média non supporté" });
    }

    let chemin_thumbnail = null;

    // Si vidéo: thumbnail fourni ou génération automatique
    if (type_media === "video") {
      if (thumbnailFile) {
        chemin_thumbnail = thumbnailFile.path;
      } else {
        // Générer un thumbnail automatiquement
        chemin_thumbnail = mediaFile.path.replace(/\.mp4$/, "-thumb.jpg");

        await new Promise((resolve, reject) => {
          ffmpeg(mediaFile.path)
            .screenshots({
              count: 1,
              folder: path.dirname(mediaFile.path),
              filename: path.basename(chemin_thumbnail),
              size: "320x240"
            })
            .on("end", resolve)
            .on("error", reject);
        });
      }
    }

    // Créer le média
    const media = await Media.creer(
      type_media,
      mediaFile.path,
      mediaFile.size,
      id_utilisateur,
      id_oeuvre,
      id_section,
      chemin_thumbnail
    );

    res.status(201).json({
      success: true,
      message: "Média téléchargé avec succès",
      data: {
        id: media.id,
        type: media.types_medias,
        chemin: media.chemin_media,
        taille: media.taille,
        date_ajout: media.date_ajout,
        thumbnail_url: media.chemin_thumbnail,
        id_section: media.id_section
      },
    });
  } catch (error) {
    console.error("Erreur uploadMedia:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du téléchargement du média",
      error: error.message,
    });
  }
};
// Récupérer un média par son ID
exports.getMediaById = async (req, res) => {
  try {
    const mediaId = req.params.id
    const media = await Media.recupererMediaParId(mediaId)
    console.log("media :",media);
    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Média non trouvé",
      })
    }

    // Vérifier si le fichier existe
    if (!fs.existsSync(media.chemin_media)) {
      return res.status(404).json({
        success: false,
        message: "Fichier média non trouvé sur le serveur",
      })
    }

    // Envoyer le fichier
    res.sendFile(path.resolve(media.chemin_media));
  } catch (error) {
    console.error("Erreur lors de la récupération du média:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du média",
      error: error.message,
    })
  }
}

exports.getMediasByOeuvre = async (req, res) => {
  try {
    const oeuvreId = req.params.oeuvreId;
    const medias = await Media.recupererParOeuvre(oeuvreId);
    console.log("medias :",medias);
    const mediasWithUrls = medias.map((media) => ({
      id: media.id,
      type: media.types_medias,
      taille: media.taille,
      date_ajout: media.date_ajout,
      chemin_media: media.chemin_media,
      id_utilisateur: media.id_utilisateur,
      id_section: media.id_section,
      thumbnail_url: media.chemin_thumbnail
    }));

    res.status(200).json({
      success: true,
      count: mediasWithUrls.length,
      data: mediasWithUrls,
    });
  } catch (error) {
    console.error("Error getting media by oeuvre:", error);
    res.status(500).json({
      success: false,
      message: "Error getting media by oeuvre",
      error: error.message,
    });
  }
};

exports.getMediaThumbById = async (req, res) => {
  try {
    const mediaId = req.params.id
    const media = await Media.recupererMediaParId(mediaId)

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Média non trouvé",
      })
    }

    // Vérifier si le fichier existe
    if (!fs.existsSync(media.chemin_media)) {
      return res.status(404).json({
        success: false,
        message: "Fichier média non trouvé sur le serveur",
      })
    }

    // Envoyer le fichier
    res.sendFile(path.resolve(media.chemin_thumbnail));
  } catch (error) {
    console.error("Erreur lors de la récupération du média:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du média",
      error: error.message,
    })
  }
}


// Récupérer les métadonnées d'un média
exports.getMediaMetadata = async (req, res) => {
  try {
    const mediaId = req.params.id
    const media = await Media.recupererMediaParId(mediaId)

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Média non trouvé",
      })
    }

    

    res.status(200).json({
      success: true,
      data: {
        id: media.id,
        type: media.types_medias,
        taille: media.taille,
        date_ajout: media.date_ajout,
        id_utilisateur: media.id_utilisateur,
        id_section: media.id_section
      },
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des métadonnées:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des métadonnées",
      error: error.message,
    })
  }
}

// Récupérer tous les médias d'une section
exports.getMediasBySection = async (req, res) => {
  try {
    const sectionId = req.params.sectionId
    const medias = await Media.recupererParSection(sectionId)

    // Générer l'URL de base
    

    // Transformer les données pour inclure l'URL
    const mediasWithUrls = medias.map((media) => ({
      id: media.id,
      type: media.types_medias,
      taille: media.taille,
      date_ajout: media.date_ajout,
      chemin_media: media.chemin_media,
      id_utilisateur: media.id_utilisateur,
      thumbnail_url: media.chemin_thumbnail
     
    }))

    res.status(200).json({
      success: true,
      count: mediasWithUrls.length,
      data: mediasWithUrls,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des médias par section:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des médias par section",
      error: error.message,
    })
  }
}

// Supprimer un média
exports.deleteMedia = async (req, res) => {
  try {
    const mediaId = req.params.id
    const media = await Media.recupererMediaParId(mediaId)

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Média non trouvé",
      })
    }

    // Vérifier si l'utilisateur a le droit de supprimer ce média
    // Cette vérification dépend de votre logique d'autorisation
    // Par exemple, vérifier si l'utilisateur est le propriétaire ou un admin
    if (req.user.id !== media.id_utilisateur && req.user.type !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à supprimer ce média",
      })
    }

    // Supprimer le fichier du système de fichiers
    if (fs.existsSync(media.chemin_media)) {
      fs.unlinkSync(media.chemin_media)
    }

    // Supprimer l'entrée de la base de données
    const deleted = await Media.supprimer(mediaId)

    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la suppression du média de la base de données",
      })
    }

    res.status(200).json({
      success: true,
      message: "Média supprimé avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de la suppression du média:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du média",
      error: error.message,
    })
  }
}

// Mettre à jour les métadonnées d'un média
exports.updateMediaMetadata = async (req, res) => {
  try {
    const mediaId = req.params.id
    const { types_medias, id_section } = req.body

    const media = await Media.recupererMediaParId(mediaId)

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Média non trouvé",
      })
    }

    // Vérifier si l'utilisateur a le droit de modifier ce média
    if (req.user.id !== media.id_utilisateur && req.user.type !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à modifier ce média",
      })
    }

    // Mettre à jour les métadonnées
    const updated = await Media.mettreAJour(
      mediaId,
      types_medias || media.types_medias,
      media.chemin_media,
      media.taille,
      media.id_utilisateur, // On ne change pas le propriétaire
      id_section || media.id_section,
    )

    if (!updated) {
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la mise à jour des métadonnées",
      })
    }

    res.status(200).json({
      success: true,
      message: "Métadonnées mises à jour avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour des métadonnées:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour des métadonnées",
      error: error.message,
    })
  }
}

// Récupérer les médias récents
exports.getRecentMedias = async (req, res) => {
  try {
    const limit = Number.parseInt(req.query.limit) || 10
    const medias = await Media.recupererRecents(limit)

    // Générer l'URL de base
   
    // Transformer les données pour inclure l'URL
    const mediasWithUrls = medias.map((media) => ({
      id: media.id,
      type: media.types_medias,
      taille: media.taille,
      date_ajout: media.date_ajout,
      chemin_media: media.chemin_media,
      id_utilisateur: media.id_utilisateur,
      id_section: media.id_section,
      thumbnail_url: media.chemin_thumbnail
    }))

    res.status(200).json({
      success: true,
      count: mediasWithUrls.length,
      data: mediasWithUrls,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des médias récents:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des médias récents",
      error: error.message,
    })
  }
}

// Rechercher des médias
exports.searchMedias = async (req, res) => {
  try {
    const keyword = req.query.keyword

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Mot-clé de recherche requis",
      })
    }

    const medias = await Media.rechercher(keyword)


    // Transformer les données pour inclure l'URL
    const mediasWithUrls = medias.map((media) => ({
      id: media.id,
      type: media.types_medias,
      taille: media.taille,
      date_ajout: media.date_ajout,
      chemin_media: media.chemin_media,
      id_utilisateur: media.id_utilisateur,
      id_section: media.id_section,
      thumbnail_url: media.chemin_thumbnail
      
    }))

    res.status(200).json({
      success: true,
      count: mediasWithUrls.length,
      data: mediasWithUrls,
    })
  } catch (error) {
    console.error("Erreur lors de la recherche de médias:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la recherche de médias",
      error: error.message,
    })
  }
}

// Obtenir les statistiques des médias par type
exports.getMediaStats = async (req, res) => {
  try {
    const stats = await Media.compterParType()

    res.status(200).json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques",
      error: error.message,
    })
  }
}
